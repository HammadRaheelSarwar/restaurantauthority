import { supabase } from '../config/supabase.js';

export const templateController = {
  async list(req, res) {
    try {
      const { data: templates } = await supabase.from('assessment_templates').select('*');
      const { data: sections } = await supabase.from('assessment_sections').select('*');
      const { data: items } = await supabase.from('assessment_items').select('*');

      // Nest sections and items within templates
      const enriched = (templates || []).map(tpl => {
        const tplSections = (sections || [])
          .filter(s => s.template_id === tpl.id)
          .sort((a, b) => a.order_index - b.order_index)
          .map(sec => ({
            ...sec,
            items: (items || [])
              .filter(i => i.section_id === sec.id)
              .sort((a, b) => a.order_index - b.order_index)
          }));
        return { ...tpl, sections: tplSections };
      });

      return res.json({ success: true, data: enriched });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  },

  async create(req, res) {
    try {
      const { data } = await supabase.from('assessment_templates').insert({
        ...req.body,
        created_by: req.user.id
      });
      return res.status(201).json({ success: true, message: 'Template created', data });
    } catch (err) {
      return res.status(500).json({ success: false, error: { message: err.message } });
    }
  }
};
