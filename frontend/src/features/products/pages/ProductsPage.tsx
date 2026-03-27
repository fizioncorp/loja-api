import { useDeferredValue, useEffect, useState } from "react";
import {
  activateProduct,
  createProduct,
  deactivateProduct,
  listProducts,
  searchProducts,
  updateProduct,
} from "../services/productsService";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import type { CreateProductDTO, PaginatedResponse, Product } from "@/types/product";

const PAGE_SIZE = 8;
type StockFilter = "ALL" | "IN_STOCK" | "OUT_OF_STOCK";
const INITIAL_FORM: CreateProductDTO = {
  name: "",
  barcode: "",
  price: 0,
  cost: 0,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function ProductCard({
  product,
  isBusy,
  onEdit,
  onToggleActive,
}: {
  product: Product;
  isBusy: boolean;
  onEdit: (product: Product) => void;
  onToggleActive: (product: Product) => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-400">Codigo de barras: {product.barcode}</p>
        </div>

        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
          {product.active ? "Ativo" : "Inativo"}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <dt className="text-slate-500">Preco</dt>
          <dd className="mt-1 font-medium text-white">{formatCurrency(product.price)}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <dt className="text-slate-500">Custo</dt>
          <dd className="mt-1 font-medium text-white">{formatCurrency(product.cost)}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <dt className="text-slate-500">Estoque</dt>
          <dd className="mt-1 font-medium text-white">{product.stock} unidades</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <dt className="text-slate-500">Criado em</dt>
          <dd className="mt-1 font-medium text-white">{formatDate(product.createdAt)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => onEdit(product)}
          disabled={isBusy}
          className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onToggleActive(product)}
          disabled={isBusy}
          className={`rounded-2xl border px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
            product.active
              ? "border-amber-500/40 text-amber-200 hover:border-amber-400"
              : "border-emerald-500/40 text-emerald-200 hover:border-emerald-400"
          }`}
        >
          {product.active ? "Desativar" : "Reativar"}
        </button>
      </div>
    </article>
  );
}

export function ProductsPage() {
  const [response, setResponse] = useState<PaginatedResponse<Product> | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [form, setForm] = useState<CreateProductDTO>(INITIAL_FORM);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CreateProductDTO>(INITIAL_FORM);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const normalizedSearchTerm = deferredSearchTerm.trim();
  const isSearchMode = normalizedSearchTerm.length > 0;

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setErrorMessage("");

        if (isSearchMode) {
          const data = await searchProducts(normalizedSearchTerm);

          if (!isMounted) {
            return;
          }

          setSearchResults(data);
          setResponse(null);
          return;
        }

        const data = await listProducts({ page, limit: PAGE_SIZE });

        if (!isMounted) {
          return;
        }

        setResponse(data);
        setSearchResults([]);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);

        if (!isMounted) {
          return;
        }

        setErrorMessage("Nao foi possivel carregar os produtos.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, [isSearchMode, normalizedSearchTerm, page, reloadKey]);

  const products = isSearchMode ? searchResults : (response?.data ?? []);
  const filteredProducts = products.filter((product) => {
    if (stockFilter === "IN_STOCK") {
      return product.stock > 0;
    }

    if (stockFilter === "OUT_OF_STOCK") {
      return product.stock <= 0;
    }

    return true;
  });
  const canGoBack = page > 1;
  const canGoForward = Boolean(!isSearchMode && response && page < response.totalPages);

  function handleRetry() {
    setErrorMessage("");
    setReloadKey((currentKey) => currentKey + 1);
  }

  function updateFormValue<K extends keyof CreateProductDTO>(
    currentForm: CreateProductDTO,
    field: K,
    value: CreateProductDTO[K],
  ) {
    return {
      ...currentForm,
      [field]: value,
    };
  }

  function updateForm<K extends keyof CreateProductDTO>(field: K, value: CreateProductDTO[K]) {
    setForm((currentForm) => updateFormValue(currentForm, field, value));
  }

  function updateEditForm<K extends keyof CreateProductDTO>(
    field: K,
    value: CreateProductDTO[K],
  ) {
    setEditForm((currentForm) => updateFormValue(currentForm, field, value));
  }

  function validateProductForm(data: CreateProductDTO) {
    if (data.name.trim().length < 2) {
      return "Nome deve ter pelo menos 2 caracteres.";
    }

    if (data.barcode.trim().length < 3) {
      return "Codigo de barras deve ter pelo menos 3 caracteres.";
    }

    if (Number(data.price) <= 0) {
      return "Preco deve ser maior que zero.";
    }

    if (Number(data.cost) < 0) {
      return "Custo nao pode ser negativo.";
    }

    return "";
  }

  async function handleCreateProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErrorMessage("");
    setSuccessMessage("");

    const validationError = validateProductForm(form);

    if (validationError) {
      setFormErrorMessage(validationError);
      return;
    }

    try {
      setIsCreating(true);

      await createProduct({
        name: form.name.trim(),
        barcode: form.barcode.trim(),
        price: Number(form.price),
        cost: Number(form.cost),
      });

      setForm(INITIAL_FORM);
      setSuccessMessage("Produto criado com sucesso.");
      setPage(1);
      setSearchTerm("");
      setStockFilter("ALL");
      setEditingProductId(null);
      setEditErrorMessage("");
      setReloadKey((currentKey) => currentKey + 1);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      setFormErrorMessage("Nao foi possivel cadastrar o produto.");
    } finally {
      setIsCreating(false);
    }
  }

  function startEditing(product: Product) {
    setEditingProductId(product.id);
    setEditForm({
      name: product.name,
      barcode: product.barcode,
      price: product.price,
      cost: product.cost,
    });
    setEditErrorMessage("");
    setSuccessMessage("");
  }

  function cancelEditing() {
    setEditingProductId(null);
    setEditForm(INITIAL_FORM);
    setEditErrorMessage("");
  }

  async function handleUpdateProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!editingProductId) {
      return;
    }

    const validationError = validateProductForm(editForm);

    if (validationError) {
      setEditErrorMessage(validationError);
      return;
    }

    try {
      setBusyProductId(editingProductId);
      setEditErrorMessage("");
      setSuccessMessage("");

      await updateProduct(editingProductId, {
        name: editForm.name.trim(),
        barcode: editForm.barcode.trim(),
        price: Number(editForm.price),
        cost: Number(editForm.cost),
      });

      setEditingProductId(null);
      setEditForm(INITIAL_FORM);
      setSuccessMessage("Produto atualizado com sucesso.");
      setReloadKey((currentKey) => currentKey + 1);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setEditErrorMessage("Nao foi possivel atualizar o produto.");
    } finally {
      setBusyProductId(null);
    }
  }

  async function handleToggleActive(product: Product) {
    try {
      setBusyProductId(product.id);
      setErrorMessage("");
      setSuccessMessage("");

      if (product.active) {
        await deactivateProduct(product.id);
        setSuccessMessage("Produto desativado com sucesso.");
      } else {
        await activateProduct(product.id);
        setSuccessMessage("Produto reativado com sucesso.");
      }

      setReloadKey((currentKey) => currentKey + 1);
    } catch (error) {
      console.error("Erro ao alterar status do produto:", error);
      setErrorMessage("Nao foi possivel alterar o status do produto.");
    } finally {
      setBusyProductId(null);
    }
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">
            Produtos
          </p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Catalogo conectado ao backend
          </h2>
          <p className="max-w-2xl text-base text-slate-300">
            Tela de catalogo com busca por nome, filtro de estoque e listagem
            autenticada do backend.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pagina</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {isSearchMode ? "-" : (response?.page ?? page)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {isSearchMode ? "Encontrados" : "Total"}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {isSearchMode ? products.length : (response?.total ?? 0)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {isSearchMode ? "Filtro" : "Por pagina"}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {isSearchMode ? filteredProducts.length : PAGE_SIZE}
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="mb-5 space-y-2">
          <h3 className="text-xl font-semibold text-white">Cadastrar produto</h3>
          <p className="text-sm text-slate-400">
            Formulario inicial ligado ao `POST /products` para acelerar a montagem do
            catalogo.
          </p>
        </div>

        <form onSubmit={handleCreateProduct} className="grid gap-4 lg:grid-cols-2">
          <Input
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
            placeholder="Nome do produto"
          />

          <Input
            value={form.barcode}
            onChange={(e) => updateForm("barcode", e.target.value)}
            placeholder="Codigo de barras"
          />

          <Input
            type="number"
            min="0.01"
            step="0.01"
            value={form.price || ""}
            onChange={(e) => updateForm("price", Number(e.target.value))}
            placeholder="Preco de venda"
          />

          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.cost || ""}
            onChange={(e) => updateForm("cost", Number(e.target.value))}
            placeholder="Custo"
          />

          {formErrorMessage ? (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 lg:col-span-2">
              {formErrorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 lg:col-span-2">
              {successMessage}
            </div>
          ) : null}

          <div className="lg:col-span-2 lg:max-w-56">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Salvando..." : "Cadastrar produto"}
            </Button>
          </div>
        </form>
      </section>

      {editingProductId ? (
        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
          <div className="mb-5 space-y-2">
            <h3 className="text-xl font-semibold text-white">Editar produto</h3>
            <p className="text-sm text-slate-400">
              Ajuste nome, codigo e precos do item selecionado sem sair da listagem.
            </p>
          </div>

          <form onSubmit={handleUpdateProduct} className="grid gap-4 lg:grid-cols-2">
            <Input
              value={editForm.name}
              onChange={(e) => updateEditForm("name", e.target.value)}
              placeholder="Nome do produto"
            />

            <Input
              value={editForm.barcode}
              onChange={(e) => updateEditForm("barcode", e.target.value)}
              placeholder="Codigo de barras"
            />

            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={editForm.price || ""}
              onChange={(e) => updateEditForm("price", Number(e.target.value))}
              placeholder="Preco de venda"
            />

            <Input
              type="number"
              min="0"
              step="0.01"
              value={editForm.cost || ""}
              onChange={(e) => updateEditForm("cost", Number(e.target.value))}
              placeholder="Custo"
            />

            {editErrorMessage ? (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 lg:col-span-2">
                {editErrorMessage}
              </div>
            ) : null}

            <div className="flex gap-3 lg:col-span-2">
              <div className="w-full max-w-56">
                <Button type="submit" disabled={busyProductId === editingProductId}>
                  {busyProductId === editingProductId ? "Salvando..." : "Salvar alteracoes"}
                </Button>
              </div>
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-slate-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_140px]">
        <Input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar produto por nome"
        />

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as StockFilter)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="ALL">Todo estoque</option>
          <option value="IN_STOCK">Com estoque</option>
          <option value="OUT_OF_STOCK">Sem estoque</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSearchTerm("");
            setStockFilter("ALL");
            setPage(1);
          }}
          className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500"
        >
          Limpar
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-400">
          {loading
            ? "Carregando produtos..."
            : isSearchMode
              ? `Busca por "${normalizedSearchTerm}" retornou ${products.length} item(ns).`
              : `Exibindo ${products.length} item(ns) na pagina atual.`}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            disabled={!canGoBack || loading || isSearchMode}
            className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Pagina anterior
          </button>

          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={!canGoForward || loading || isSearchMode}
            className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Proxima pagina
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          <div>{errorMessage}</div>
          <div className="mt-4 max-w-40">
            <Button type="button" onClick={handleRetry}>
              Tentar novamente
            </Button>
          </div>
        </div>
      ) : null}

      {!loading && !errorMessage && filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-sm text-slate-300">
          {isSearchMode
            ? "Nenhum produto corresponde aos filtros aplicados."
            : "Nenhum produto ativo foi encontrado para esta loja."}
        </div>
      ) : null}

      {filteredProducts.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isBusy={busyProductId === product.id}
              onEdit={startEditing}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
