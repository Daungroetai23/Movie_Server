// controllers/paymentController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /payments - ดึงข้อมูลการชำระเงินทั้งหมด
const getAllPayments = async (req, res) => {
    try {
        const payments = await prisma.payment.findMany();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve payments' });
    }
};

// GET /payments/:id - ดึงข้อมูลการชำระเงินตาม ID
const getPaymentById = async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: parseInt(id) }
        });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve payment' });
    }
};

// POST /payments - สร้างการชำระเงินใหม่
const createPayment = async (req, res) => {
    const newPayment = req.body;
    try {
        const createdPayment = await prisma.payment.create({
            data: newPayment
        });
        res.status(201).json(createdPayment);
    } catch (error) {
        res.status(500).json({ error: 'Could not create payment' });
    }
};

// PUT /payments/:id - แก้ไขข้อมูลการชำระเงินตาม ID
const updatePayment = async (req, res) => {
    const { id } = req.params;
    const updatedPayment = req.body;
    try {
        const existingPayment = await prisma.payment.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        const updated = await prisma.payment.update({
            where: { id: parseInt(id) },
            data: updatedPayment
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Could not update payment' });
    }
};

// DELETE /payments/:id - ลบการชำระเงินตาม ID
const deletePayment = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPayment = await prisma.payment.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Payment deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Could not delete payment' });
    }
};

module.exports = {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
};
