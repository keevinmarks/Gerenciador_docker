import express from "express";
import type { Connection, RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import getConnection from "../../mysqlConnection/mysqlConnection.js";

export const printersRouter = express.Router();

/* =========================
   ZOD SCHEMAS
========================= */

const printerSchema = z.object({
  id_printer: z.number().int().positive().optional(),
  name_printer: z.string().min(2),
  mac_printer: z.string().min(12),
  asset_number: z.number().int().positive(),
  status_printer: z.number().int().nonnegative(),
  exit_date: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  return_date: z.string().nullable().optional(),
});

const idSchema = z.object({
  id_printer: z.number().int().positive(),
});

/* =========================
   CREATE
========================= */
printersRouter.post("/", async (req, res) => {
  const validation = printerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false });
  }

  let connection: Connection | null = null;

  try {
    connection = await getConnection();
    if (!connection) {
      return res.status(500).json({ success: false });
    }

    const {
      name_printer,
      mac_printer,
      asset_number,
      status_printer,
      exit_date,
      reason,
      return_date,
    } = validation.data;

    await connection.execute(
      `
      INSERT INTO printers
      (name_printer, mac_printer, asset_number, status_printer, exit_date, reason, return_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name_printer,
        mac_printer,
        asset_number,
        status_printer,
        exit_date ?? null,
        reason ?? null,
        return_date ?? null,
      ]
    );

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("POST printers:", error);
    return res.status(500).json({ success: false });
  } finally {
    connection?.end();
  }
});

/* =========================
   UPDATE
========================= */
printersRouter.put("/", async (req, res) => {
  const validation = printerSchema.safeParse(req.body);
  if (!validation.success || !validation.data.id_printer) {
    return res.status(400).json({ success: false });
  }

  let connection: Connection | null = null;

  try {
    connection = await getConnection();
    if (!connection) {
      return res.status(500).json({ success: false });
    }

    const {
      id_printer,
      name_printer,
      mac_printer,
      asset_number,
      status_printer,
      exit_date,
      reason,
      return_date,
    } = validation.data;

    await connection.execute(
      `
      UPDATE printers SET
        name_printer = ?,
        mac_printer = ?,
        asset_number = ?,
        status_printer = ?,
        exit_date = ?,
        reason = ?,
        return_date = ?
      WHERE id_printer = ?
      `,
      [
        name_printer,
        mac_printer,
        asset_number,
        status_printer,
        exit_date ?? null,
        reason ?? null,
        return_date ?? null,
        id_printer,
      ]
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("PUT printers:", error);
    return res.status(500).json({ success: false });
  } finally {
    connection?.end();
  }
});

/* =========================
   READ
========================= */
printersRouter.get("/", async (_req, res) => {
  let connection: Connection | null = null;

  try {
    connection = await getConnection();
    if (!connection) {
      return res.status(500).json({ success: false });
    }

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM printers"
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET printers:", error);
    return res.status(500).json({ success: false });
  } finally {
    connection?.end();
  }
});

/* =========================
   DELETE
========================= */
printersRouter.delete("/:id_printer", async (req, res) => {
  const validation = idSchema.safeParse({
    id_printer: Number(req.params.id_printer),
  });

  if (!validation.success) {
    return res.status(400).json({ success: false });
  }

  let connection: Connection | null = null;

  try {
    connection = await getConnection();
    if (!connection) {
      return res.status(500).json({ success: false });
    }

    await connection.execute(
      "DELETE FROM printers WHERE id_printer = ?",
      [validation.data.id_printer]
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("DELETE printers:", error);
    return res.status(500).json({ success: false });
  } finally {
    connection?.end();
  }
});
