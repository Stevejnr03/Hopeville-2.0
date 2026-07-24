import db from "../config/db.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/uploadToCloudinary.js";

async function getFullProduct(id) {
  const product = await db("products").where({ id }).first();
  if (!product) return null;

  const images = await db("product_images")
    .where({ product_id: id })
    .orderBy("display_order");
  const colors = await db("product_colors").where({ product_id: id });
  const lensOptions = await db("product_lens_options").where({
    product_id: id,
  });
  const features = await db("product_features").where({ product_id: id });

  return {
    ...product,
    images: images.filter((i) => !i.is_hover).map((i) => i.image_url),
    hoverImage: images.find((i) => i.is_hover)?.image_url || null,
    tryonImage: product.tryon_image_url || null,
    colors: colors.map((c) => ({ name: c.name, hex: c.hex })),
    lensOptions: lensOptions.map((l) => l.option_name),
    features: features.map((f) => f.feature),
  };
}

export async function getAllProducts(req, res) {
  try {
    const { category, shape, search } = req.query;

    let query = db("products").where({});
    if (category) query = query.where({ category });
    if (shape) query = query.where({ shape });
    if (search) query = query.whereILike("name", `%${search}%`);

    const products = await query.orderBy("created_at", "desc");
    const full = await Promise.all(products.map((p) => getFullProduct(p.id)));
    res.json(full);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProductBySlug(req, res) {
  try {
    const product = await db("products")
      .where({ slug: req.params.slug })
      .first();
    if (!product) return res.status(404).json({ error: "Product not found" });

    const full = await getFullProduct(product.id);
    res.json(full);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      name,
      variant,
      price,
      category,
      shape,
      material,
      origin,
      description,
      lens_width,
      bridge_width,
      temple_length,
      is_new,
      in_stock,
      prescription_available,
      colors,
      lens_options,
      features,
    } = req.body;

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const [product] = await db("products")
      .insert({
        slug,
        name,
        variant,
        price,
        category,
        shape,
        material,
        origin,
        description,
        lens_width,
        bridge_width,
        temple_length,
        is_new: is_new === "true" || is_new === true,
        in_stock: in_stock !== "false" && in_stock !== false,
        prescription_available: prescription_available !== "false",
      })
      .returning("*");

    // ✅ Upload all 4 image slots — no leftover hoverFile code
    if (req.files) {
      const imageFields = [
        { key: "image", isHover: false, order: 0 },
        { key: "image2", isHover: false, order: 1 },
        { key: "image3", isHover: false, order: 2 },
        { key: "hoverImage", isHover: true, order: 3 },
      ];

      for (const field of imageFields) {
        const file = req.files[field.key]?.[0];
        if (file) {
          const result = await uploadToCloudinary(
            file.buffer,
            "hopeville/products",
          );
          await db("product_images").insert({
            product_id: product.id,
            image_url: result.secure_url,
            public_id: result.public_id,
            is_hover: field.isHover,
            display_order: field.order,
          });
        }
      }

      const tryonFile = req.files?.tryonImage?.[0];
      if (tryonFile) {
        const result = await uploadToCloudinary(
          tryonFile.buffer,
          "hopeville/tryon",
        );
        await db("products").where({ id: product.id }).update({
          tryon_image_url: result.secure_url,
          tryon_image_public_id: result.public_id,
        });
      }
    }

    // Insert related data
    if (colors) {
      const parsed = typeof colors === "string" ? JSON.parse(colors) : colors;
      await db("product_colors").insert(
        parsed.map((c) => ({ product_id: product.id, ...c })),
      );
    }

    if (lens_options) {
      const parsed =
        typeof lens_options === "string"
          ? JSON.parse(lens_options)
          : lens_options;
      await db("product_lens_options").insert(
        parsed.map((o) => ({ product_id: product.id, option_name: o })),
      );
    }

    if (features) {
      const parsed =
        typeof features === "string" ? JSON.parse(features) : features;
      await db("product_features").insert(
        parsed.map((f) => ({ product_id: product.id, feature: f })),
      );
    }

    const full = await getFullProduct(product.id);
    res.status(201).json(full);
  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await db("products").where({ id }).first();
    if (!product) return res.status(404).json({ error: "Product not found" });

    const updates = { ...req.body };
    if (updates.is_new !== undefined) {
      updates.is_new = updates.is_new === "true" || updates.is_new === true;
    }
    if (updates.in_stock !== undefined) {
      updates.in_stock =
        updates.in_stock !== "false" && updates.in_stock !== false;
    }

    await db("products")
      .where({ id })
      .update({ ...updates, updated_at: new Date() });

    // ✅ Handle all 4 image slots — no leftover hoverFile code
    if (req.files) {
      const imageFields = [
        { key: "image", isHover: false, order: 0 },
        { key: "image2", isHover: false, order: 1 },
        { key: "image3", isHover: false, order: 2 },
        { key: "hoverImage", isHover: true, order: 3 },
      ];

      for (const field of imageFields) {
        const file = req.files[field.key]?.[0];
        if (file) {
          // Delete old image at this position from Cloudinary and DB
          const old = await db("product_images")
            .where({ product_id: id, display_order: field.order })
            .first();
          if (old?.public_id) await deleteFromCloudinary(old.public_id);
          await db("product_images")
            .where({ product_id: id, display_order: field.order })
            .delete();

          // Upload new image
          const result = await uploadToCloudinary(
            file.buffer,
            "hopeville/products",
          );
          await db("product_images").insert({
            product_id: id,
            image_url: result.secure_url,
            public_id: result.public_id,
            is_hover: field.isHover,
            display_order: field.order,
          });
        }
      }

      const tryonFile = req.files?.tryonImage?.[0];
      if (tryonFile) {
        // Delete old tryon image
        if (product.tryon_image_public_id) {
          await deleteFromCloudinary(product.tryon_image_public_id);
        }
        const result = await uploadToCloudinary(
          tryonFile.buffer,
          "hopeville/tryon",
        );
        await db("products").where({ id: id }).update({
          tryon_image_url: result.secure_url,
          tryon_image_public_id: result.public_id,
          updated_at: new Date(),
        });
      }
    }

    const full = await getFullProduct(id);
    res.json(full);
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const images = await db("product_images").where({ product_id: id });

    await Promise.all(
      images.map((img) =>
        img.public_id ? deleteFromCloudinary(img.public_id) : Promise.resolve(),
      ),
    );

    await db("products").where({ id }).delete();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function toggleStock(req, res) {
  try {
    const { id } = req.params;
    const product = await db("products").where({ id }).first();
    if (!product) return res.status(404).json({ error: "Product not found" });

    await db("products").where({ id }).update({ in_stock: !product.in_stock });
    res.json({ in_stock: !product.in_stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
