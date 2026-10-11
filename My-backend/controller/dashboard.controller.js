import Transaction from "../model/transaction.model.js";
export const getDashboardStats = async (req, res) => {
    try {const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }
    const transactions = await Transaction.find({
      userId: userId,
      
      // date: "2026-10-15T00:00:00.000+00:00"
    });

        // Aggregate totals
        const totals = await Transaction.aggregate([
             {
        $match: {
          userId: new (await import("mongoose")).default.Types.ObjectId(userId),
        },
      },
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        // Initialize values
        let totalIncome = 0;
        let totalExpense = 0;

        // Assign totals based on type
        totals.forEach(item => {
            if (item._id === 'Income') totalIncome = item.totalAmount;
            if (item._id === 'Expense') totalExpense = item.totalAmount;
        });

        // Calculate balance
        const balance = totalIncome - totalExpense;


        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance
            }
        });
    } catch (error) {
        console.error('Dashboard API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard stats'
        });
    }
};