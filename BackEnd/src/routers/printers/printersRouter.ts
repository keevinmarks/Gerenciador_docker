import express from "express";
import type { Request, Response } from "express";
import type { Connection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { z } from "zod";
import getConnection from "../../mysqlConnection/mysqlConnection.js";

export const printersRouter = express.Router();

/* =========================
   ZOD SCHEMAS
========================= */

const printerSchema = z.object({
  id_printer: z.number().int().positive().optional(),

  name_printer: z.string().min(2),
  type_printer: z.string().min(2),

  mac_printer: z.string().min(12).max(30),
  asset_number: z.number().int().positive(),

  status_printer: z.union([z.literal(0), z.literal(1)]),

  exit_date: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  return_date: z.string().nullable().optional(),
});

const idSchema = z.object({
  id_printer: z.number().int().positive(),
});

const updatePrinterSchema = printerSchema.extend({
  id_printer: z.number().int().positive(),
});

/* =========================
   CREATE
========================= */
printersRouter.post("/", async (req: Request, res: Response) => {
  const validation = printerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      errors: validation.error.format(),
    });
  }

  const connection = await getConnection();
  if (!connection) return res.status(500).json({ success: false });

  try {
    const {
      name_printer,
      type_printer,
      mac_printer,
      asset_number,
      status_printer,
      exit_date,
      reason,
      return_date,
    } = validation.data;

    const [result] = await connection.execute<ResultSetHeader>(
      `
      INSERT INTO printers
      (name_printer, type_printer, mac_printer, asset_number, status_printer, exit_date, reason, return_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name_printer,
        type_printer,
        mac_printer,
        asset_number,
        status_printer,
        exit_date ?? null,
        reason ?? null,
        return_date ?? null,
      ]
    );

    return res.status(201).json({
      success: true,
      id_printer: result.insertId,
    });
  } catch (error) {
    console.error("POST printers:", error);
    const e = error as any;
    if (e && (e.code === "ER_DUP_ENTRY" || e.errno === 1062)) {
      return res.status(409).json({ success: false, message: "Entrada duplicada: tombo ou MAC já cadastrado" });
    }
    return res.status(500).json({ success: false, message: "Erro interno ao inserir impressora" });
  } finally {
    await connection.end();
  }
});

/* =========================
   UPDATE
========================= */
printersRouter.put("/", async (req: Request, res: Response) => {
  const validation = updatePrinterSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      errors: validation.error.format(),
    });
  }

  const connection = await getConnection();
  if (!connection) return res.status(500).json({ success: false });

  try {
    const {
      id_printer,
      name_printer,
      type_printer,
      mac_printer,
      asset_number,
      status_printer,
      exit_date,
      reason,
      return_date,
    } = validation.data;

    const [result] = await connection.execute<ResultSetHeader>(
      `
      UPDATE printers SET
      name_printer = ?,
      type_printer = ?,
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
        type_printer,
        mac_printer,
        asset_number,
        status_printer,
        exit_date ?? null,
        reason ?? null,
        return_date ?? null,
        id_printer,
      ]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Impressora não encontrada" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("PUT printers:", error);
    return res.status(500).json({ success: false });
  } finally {
    await connection.end();
  }
});

/* =========================
   DELETE
========================= */
printersRouter.delete("/:id", async (req: Request, res: Response) => {
  const parsed = idSchema.safeParse({ id_printer: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ success: false, errors: parsed.error.format() });
  }

  const connection = await getConnection();
  if (!connection) return res.status(500).json({ success: false });

  try {
    const [result] = await connection.execute<ResultSetHeader>(
      "DELETE FROM printers WHERE id_printer = ?",
      [parsed.data.id_printer]
    );

    if ((result as ResultSetHeader).affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Impressora não encontrada" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("DELETE printers:", error);
    return res.status(500).json({ success: false });
  } finally {
    await connection.end();
  }
});


/* =========================
   READ
========================= */
printersRouter.get("/", async (_req: Request, res: Response) => {
  const connection = await getConnection();
  if (!connection) return res.status(500).json({ success: false });

  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM printers ORDER BY created_at DESC"
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET printers:", error);
    return res.status(500).json({ success: false });
  } finally {
    await connection.end();
  }
});

