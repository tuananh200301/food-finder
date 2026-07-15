const { Food, Category, Restaurant } = require('../models');

exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.findAll({
      include: [{ model: Category, through: { attributes: [] } }]
    });
    res.json({ success: true, data: foods });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findByPk(req.params.id, {
      include: [
        { model: Category, through: { attributes: [] } },
        { model: Restaurant, through: { attributes: ['price'] } }
      ]
    });
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.createFood = async (req, res) => {
  try {
    const { name, description, referencePrice } = req.body;
    let categoryIds = req.body.categoryIds;
    if (typeof categoryIds === 'string') {
      try { categoryIds = JSON.parse(categoryIds); } catch(e) {}
    }

    let image = req.body.image || null;
    if (req.file) {
      image = req.file.path;
    }
    const food = await Food.create({ name, description, referencePrice, image });
    if (categoryIds && categoryIds.length > 0) {
      await food.setCategories(categoryIds);
    }
    const createdFood = await Food.findByPk(food.id, { include: [Category] });
    res.status(201).json({ success: true, data: createdFood });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, referencePrice } = req.body;
    let categoryIds = req.body.categoryIds;
    if (typeof categoryIds === 'string') {
      try { categoryIds = JSON.parse(categoryIds); } catch(e) {}
    }

    let image = req.body.image;
    if (req.file) {
      image = req.file.path;
    }
    
    const food = await Food.findByPk(id);
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });

    let updateData = { name, description, referencePrice };
    if (image !== undefined) updateData.image = image;

    await food.update(updateData);
    
    if (categoryIds) {
      await food.setCategories(categoryIds);
    }

    const updatedFood = await Food.findByPk(id, { include: [Category] });
    res.json({ success: true, data: updatedFood });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Food.destroy({ where: { id } });
    if (deleted) {
      return res.json({ success: true, message: 'Food deleted' });
    }
    res.status(404).json({ success: false, message: 'Food not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
