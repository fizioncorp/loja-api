import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { createProductSchema } from "../validators/product.validator";

const router = Router();

/**
 * Criar produto
 */
router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const parsed = createProductSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues
        });
      }

      const { name, barcode, price, cost } = parsed.data;

      const product = await prisma.product.create({
        data: {
          name,
          barcode,
          price,
          cost,
          storeId: req.user!.storeId
        }
      });

      return res.status(201).json(product);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar produto" });
    }
  }
);

/**
 * Listar produtos (COM PAGINAÇÃO)
 */
router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const skip = (page - 1) * limit;

      const products = await prisma.product.findMany({
        where: {
          storeId: req.user!.storeId
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      });

      const total = await prisma.product.count({
        where: {
          storeId: req.user!.storeId
        }
      });

      return res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: products
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao listar produtos" });
    }
  }
);

// Buscar produtos por nome
router.get(
  "/search",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {

      const name = String(req.query.name || "");

      const products = await prisma.product.findMany({
        where: {
          storeId: req.user!.storeId,
          name: {
            contains: name,
            mode: "insensitive"
          }
        },
        take: 10
      });

      return res.json(products);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao buscar produtos"
      });
    }
  }
);

/**
 * Buscar produto por código de barras
 */
router.get(
  "/barcode/:barcode",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const barcode = String(req.params.barcode);

      const product = await prisma.product.findFirst({
        where: {
          barcode,
          storeId: req.user!.storeId
        }
      });

      if (!product) {
        return res.status(404).json({
          error: "Produto não encontrado"
        });
      }

      return res.json(product);

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao buscar produto"
      });
    }
  }
);



export default router;