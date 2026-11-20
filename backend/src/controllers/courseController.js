import { supabase } from '../config/supabase.js';

export const courseController = {
  async listCourses(req, res) {
    try {
      const { data: courses } = await supabase.from('certification_courses').select('*');
      const { data: modules } = await supabase.from('course_modules').select('*');

      const enriched = (courses || []).map(course => ({
        ...course,
        modules: (modules || [])
          .filter(m => m.course_id === course.id)
          .sort((a, b) => a.order_index - b.order_index)
      }));

      return res.json({ success: true, data: enriched });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async markModuleCompleted(req, res) {
    try {
      const { moduleId } = req.params;
      const { application_id } = req.body;

      const { data } = await supabase.from('course_progress').insert({
        application_id,
        user_id: req.user.id,
        module_id: moduleId,
        is_completed: true,
        completed_at: new Date().toISOString()
      });

      return res.json({ success: true, message: 'Module marked as completed', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
