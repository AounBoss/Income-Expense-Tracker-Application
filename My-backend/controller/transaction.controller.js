import Transaction from "../model/transaction.model.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, description, userId } = req.body;

    const transaction = await Transaction.create({
      type,
      amount,
      
      date,
      description,
      userId,
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
    const transactions = await Transaction.find()
      .populate("category")
      .populate("userId");

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
    const transaction = await Transaction.findById(req.params.id)
      .populate("category")
      .populate("userId");

    if (!transaction) {s
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
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
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
  } catch (error) {
    res.status(500).json({
      message: "Failed to update transaction",
      error: error.message,
    });
  }
};


export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete transaction",
      error: error.message,
    });
  }
};