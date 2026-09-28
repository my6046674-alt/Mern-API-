import productService from "../services/product.service.js";

const getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts(req.query);

  res.json(products);
};

const getProductById = async (req, res) => {
  const id = req.params.id;

  const product = await productService.getProductById(id);

  if (!product) return res.status(404).json({ message: "Product not found." });

  res.json(product);
};

const createProduct = async (req, res) => {
  const userId = req.user._id;

  try {
    const product = await productService.createProduct(
      req.body,
      req.files,
      userId,
    );

    res.json(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const input = req.body;

  try {
    const product = await productService.updateProduct(id, input, req.files);

    res.json(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    await productService.deleteProduct(id, req.user);

    res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getBrands = async (req, res) => {
  const brands = await productService.getBrands();

  res.json(brands);
};

const getCategories = async (req, res) => {
  const categories = await productService.getCategories();

  res.json(categories);
};

const getTotalCount = async (req, res) => {
  const count = await productService.getTotalCount();

  res.json(count);
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands,
  getCategories,
  getTotalCount,
};