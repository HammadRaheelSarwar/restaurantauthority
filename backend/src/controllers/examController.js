import { supabase } from '../config/supabase.js';
import { realtimeService } from '../services/realtimeService.js';

export const examController = {
  async getExam(req, res) {
    try {
      const { id } = req.params;
      const { data: exam } = await supabase.from('exams').select('*').eq('id', id).single();
      if (!exam) return res.status(404).json({ success: false, error: { message: 'Exam not found' } });

      const { data: questions } = await supabase.from('exam_questions').select('*').eq('exam_id', id);

      // Sanitize questions: strip correct_answers so client cannot inspect developer tools to cheat!
      const sanitizedQuestions = (questions || []).map(q => ({
        id: q.id,
        question_type: q.question_type,
        question_text: q.question_text,
        options: q.options,
        points: q.points,
        order_index: q.order_index
      }));

      return res.json({
        success: true,
        data: {
          ...exam,
          questions: sanitizedQuestions
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async submitExam(req, res) {
    try {
      const { id } = req.params;
      const { application_id, answers = [] } = req.body;

      const { data: exam } = await supabase.from('exams').select('*').eq('id', id).single();
      const { data: questions } = await supabase.from('exam_questions').select('*').eq('exam_id', id);

      let totalPoints = 0;
      let earnedPoints = 0;

      for (const question of questions || []) {
        totalPoints += question.points || 10;
        const userAnswerObj = answers.find(a => a.question_id === question.id);
        const userAnswer = userAnswerObj ? userAnswerObj.selected_options : [];

        // Compare answer array with correct_answers array
        const isCorrect = Array.isArray(question.correct_answers) &&
          Array.isArray(userAnswer) &&
          question.correct_answers.length === userAnswer.length &&
          question.correct_answers.every(val => userAnswer.includes(val));

        if (isCorrect) {
          earnedPoints += question.points || 10;
        }
      }

      const percentage = totalPoints > 0 ? Number(((earnedPoints / totalPoints) * 100).toFixed(2)) : 0;
      const passed = percentage >= (exam.passing_percentage || 80);

      // Create attempt record
      const { data: attempt } = await supabase.from('exam_attempts').insert({
        exam_id: id,
        user_id: req.user.id,
        application_id,
        score: earnedPoints,
        percentage,
        passed,
        status: 'evaluated',
        submit_time: new Date().toISOString()
      });

      // If passed, transition application status to 'passed'
      if (passed && application_id) {
        await supabase.from('certification_applications').eq('id', application_id).update({
          status: 'passed'
        });
      }

      if (passed) {
        realtimeService.broadcast('CERTIFICATE_ISSUED', {
          user_id: req.user.id,
          candidate_name: req.user.full_name,
          percentage
        });
      }

      return res.json({
        success: true,
        message: passed ? 'Congratulations! You have passed the certification exam.' : 'Exam completed. You did not meet the passing threshold.',
        data: {
          passed,
          score: earnedPoints,
          totalPoints,
          percentage,
          passingThreshold: exam.passing_percentage
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
