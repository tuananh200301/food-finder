const { Category, Food } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [{
        model: Food,
        through: { attributes: [] }
      }]
    });
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    let image = req.body.image || null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    const category = await Category.create({ name, image });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let updateData = { name };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image;
    }
    const [updated] = await Category.update(updateData, { where: { id } });
    if (updated) {
      const updatedCategory = await Category.findByPk(id);
      return res.json({ success: true, data: updatedCategory });
    }
    res.status(404).json({ success: false, message: 'Category not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (deleted) {
      return res.json({ success: true, message: 'Category deleted' });
    }
    res.status(404).json({ success: false, message: 'Category not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
