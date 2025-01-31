import express from "express";
import { client } from "../db/index.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  getRandomProbability,
  generateConfirmationCode,
  generateRandomCodenames,
  validStatuses,
} from "../utils/gadgetHelpers.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Gadgets
 *   description: Gadget management API
 */

/**
 * @swagger
 * /gadgets:
 *   get:
 *     summary: Retrieve all gadgets or filter by status
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter gadgets by status (Available, Deployed, Destroyed, Decommissioned)
 *     responses:
 *       200:
 *         description: List of gadgets with success probability
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 *                   successProbability:
 *                     type: number
 *                     description: Random success probability
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const gadgets = await client.gadget.findMany({
      where: status ? { status } : {},
    });
    const gadgetsProbability = gadgets.map((gadget) => ({
      ...gadget,
      successProbability: getRandomProbability(),
    }));
    res.json(gadgetsProbability);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve gadgets" });
  }
});

/**
 * @swagger
 * /gadgets:
 *   post:
 *     summary: Create a new gadget
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Status of the gadget
 *     responses:
 *       201:
 *         description: Gadget successfully created
 *       500:
 *         description: Failed to create gadget
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const gadget = await client.gadget.create({
      data: {
        name: generateRandomCodenames(),
        status,
      },
    });

    res.status(200).json(gadget);
  } catch (error) {
    res.status(500).json({ error: "failed to create gadget" });
  }
});

/**
 * @swagger
 * /gadgets/{id}:
 *   patch:
 *     summary: Update an existing gadget
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Gadget ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the gadget
 *               status:
 *                 type: string
 *                 description: New status for the gadget
 *     responses:
 *       200:
 *         description: Gadget updated successfully
 *       500:
 *         description: Failed to update gadget
 */
router.patch("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  try {
    const gadget = await client.gadget.update({
      where: { id },
      data: { name, status },
    });
    res.status(200).json(gadget);
  } catch (error) {
    res.status(500).json({ error: "Failed to update gadget" });
  }
});

/**
 * @swagger
 * /gadgets/{id}:
 *   delete:
 *     summary: Decommission a gadget
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Gadget ID to decommission
 *     responses:
 *       200:
 *         description: Gadget successfully decommissioned
 *       500:
 *         description: Failed to decommission gadget
 */
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const gadget = await client.gadget.update({
      where: { id },
      data: { status: "Decommissioned", decommissionedAt: new Date() },
    });
    res.status(200).json(gadget);
  } catch (error) {
    res.status(500).json({ error: "Failed to decommission gadget" });
  }
});

/**
 * @swagger
 * /gadgets/{id}/self-destruct:
 *   post:
 *     summary: Initiate self-destruct sequence for a gadget
 *     tags: [Gadgets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Gadget ID to self-destruct
 *     responses:
 *       200:
 *         description: Self-destruct sequence initiated
 *       500:
 *         description: Failed to initiate self-destruct sequence
 */
router.post("/:id/self-destruct", async (req, res) => {
  try {
    res.status(200).json({
      message: "Self-destruct sequence initiated",
      confirmationCode: generateConfirmationCode(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to initiate self-destruct sequence" });
  }
});

export default router;
