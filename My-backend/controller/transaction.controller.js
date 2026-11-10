import Category from "../model/categories.model.js";
import Transaction from "../model/transaction.model.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;

    const transaction = await Transaction.create({
      type,
      amount,
      category,
      date,
      description,
      userId:req.user.id
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create transaction",
      error: error.message,
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // const userId = req.headers["x-user-id"];
    // if (!userId) {
    //   return res.status(400).json({
    //     message: "User ID is required",
    //   });
    // }
    const transactions = await Transaction.find({
      userId: req.user.id,
    }).populate("category");

    res.status(200).json({
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById({_id:req.params.id,userId:req.user.id,})
      .populate("category", "name");

      

    if (!transaction) {
      
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transaction",
      error: error.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {const { userId, ...updates } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
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

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) { if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }
    res.status(500).json({
      message: "Failed to update transaction",
      error: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete({_id:req.params.id,userId:req.user.id,});

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }
    res.status(500).json({
      message: "Failed to delete transaction",
      error: error.message,
    });
  }
};
