import Category from "../model/categories.model.js";


export const createCategory = async (req, res) => {
  try {
    const { name,  budget } = req.body;

    const category = await Category.create({
      name,
      
      budget,
      userId:req.user.id
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};


export const getCategories = async (req, res) => {
   try {
  // {const userId = req.headers["x-user-id"];
  //   if (!userId) {
  //     return res.status(400).json({
  //       message: "User ID is required",
  //     });
  //   }
    const categories = await Category.find({
      userId:req.user.id,
    });

    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};
export const updateCategory = async (req, res) => {
  try {const { userId, ...updates } = req.body;
    const category = await Category.findByIdAndUpdate(
      // req.params.id,
      // req.body,
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }
    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete({ _id: req.params.id,
      userId: req.user.id,});

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error){ if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};