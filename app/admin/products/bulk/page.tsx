"use client";

import AdminLayout from "../../_components/AdminLayout";
import { useState, useRef } from "react";
import { parseCSV } from "../../../lib/csv-parser";

interface ParsedRow {
  rowNumber: number;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: string;
  store: string;
  affiliate_link?: string;
  image?: string;
  errors: string[];
}

interface ImportResult {
  created: number;
  skipped: number;
  failed: number;
  details: Array<{
    rowNumber: number;
    name: string;
    status: "created" | "skipped" | "failed";
    message: string;
  }>;
}

export default function BulkProductPage() {
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "complete">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function downloadTemplate() {
    const headers = [
      "Product Name",
      "Description",
      "Category",
      "Subcategory",
      "Price",
      "Store",
      "Affiliate Link",
      "Image URL",
    ];

    // Escape CSV values properly
    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const exampleRow = [
      "Example Product",
      "A great find worth discovering",
      "Home & Living",
      "Decor",
      "From R299",
      "SHEIN",
      "https://affiliate-link.com",
      "https://image-url.com/image.jpg",
    ].map(escapeCSV).join(",");

    const csv = [headers.join(","), exampleRow].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tfe-bulk-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith(".csv")) {
      setMessage("Please upload a CSV file.");
      setMessageType("error");
      return;
    }

    setFile(uploadedFile);
    await handleParsedCSV(uploadedFile);
  }

  async function handleParsedCSV(file: File) {
    try {
      const text = await file.text();
      const result = parseCSV(text, 25);

      if (result.error) {
        setMessage(result.error);
        setMessageType("error");
        return;
      }

      if (result.rows.length === 0) {
        setMessage("No product rows found in CSV.");
        setMessageType("error");
        return;
      }

      // Parse rows - only extract raw values, no client-side processing
      const parsed: ParsedRow[] = [];
      const productNames = new Set<string>();

      for (let i = 0; i < result.rows.length; i++) {
        const values = result.rows[i];
        const rowNumber = i + 2; // Account for header row

        const row: ParsedRow = {
          rowNumber,
          name: values[0] || "",
          description: values[1] || "",
          category: values[2] || "",
          subcategory: values[3] || "",
          price: values[4] || "",
          store: values[5] || "",
          affiliate_link: values[6] && values[6].trim() ? values[6].trim() : undefined,
          image: values[7] && values[7].trim() ? values[7].trim() : undefined,
          errors: [],
        };

        // Only basic validation client-side
        if (!row.name.trim()) {
          row.errors.push("Product name is required");
        }
        if (!row.description.trim()) {
          row.errors.push("Description is required");
        }
        if (!row.category.trim()) {
          row.errors.push("Category is required");
        }
        if (!row.subcategory.trim()) {
          row.errors.push("Subcategory is required");
        }
        if (!row.price.trim()) {
          row.errors.push("Price is required");
        }
        if (!row.store.trim()) {
          row.errors.push("Store is required");
        }

        // Check for duplicate within batch (case-insensitive, normalized whitespace)
        const nameLower = row.name.toLowerCase().trim();
        if (productNames.has(nameLower)) {
          row.errors.push("Duplicate product name in this batch");
        }
        productNames.add(nameLower);

        parsed.push(row);
      }

      if (parsed.length === 0) {
        setMessage("No valid rows found in CSV.");
        setMessageType("error");
        return;
      }

      // Server will verify existing products and do all validation
      setRows(parsed);
      setStep("preview");
      setMessage("");
      setMessageType("");
    } catch (err) {
      setMessage(`Error parsing CSV: ${err instanceof Error ? err.message : "Unknown error"}`);
      setMessageType("error");
    }
  }

  async function handleImport() {
    const validRows = rows.filter((r) => r.errors.length === 0);

    if (validRows.length === 0) {
      setMessage("No valid products to import. Please fix errors and try again.");
      setMessageType("error");
      return;
    }

    setStep("importing");
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/products/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: validRows }),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(error.message || "Import failed");
        setMessageType("error");
        setStep("preview");
        return;
      }

      const result: ImportResult = await response.json();
      setImportResult(result);
      setStep("complete");
      setMessage(`Successfully imported ${result.created} product(s).`);
      setMessageType("success");
    } catch (err) {
      setMessage(`Import error: ${err instanceof Error ? err.message : "Unknown error"}`);
      setMessageType("error");
      setStep("preview");
    }
  }

  return (
    <AdminLayout
      currentSection="products"
      title="Add products in bulk"
      description="Upload a CSV file to import up to 25 products at once."
    >
      <div className="max-w-4xl space-y-6">
        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              messageType === "success"
                ? "bg-[#E5F3EC] text-[#23684A] border border-[#CFE1D4]"
                : "bg-[#FFF6E8] text-[#76511D] border border-[#E8D5B8]"
            }`}
          >
            {message}
          </div>
        )}

        {step === "upload" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-[#EAE6DF] bg-white p-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold text-[#18302F]">
                  Download template
                </h2>
                <p className="text-sm text-[#687572]">
                  Start with the template to ensure your CSV has the correct format and columns.
                </p>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="rounded-lg border border-[#176B6B] px-4 py-2.5 text-sm font-medium text-[#176B6B] transition hover:bg-[#F4F0E9]"
                >
                  Download CSV template
                </button>
              </div>
            </div>

            <div className="rounded-lg border-2 border-dashed border-[#D8D2C8] bg-[#FFFDF9] p-8">
              <div className="text-center">
                <p className="font-medium text-[#18302F]">Upload your CSV file</p>
                <p className="mt-2 text-sm text-[#687572]">Maximum 25 products per import</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="mt-4 block w-full text-sm text-[#5B6470]"
                />
              </div>
            </div>
          </div>
        )}

        {step === "preview" && rows.length > 0 && (
          <div className="space-y-6">
            <div className="rounded-lg border border-[#EAE6DF] bg-white p-6">
              <h2 className="font-serif text-xl font-semibold text-[#18302F]">
                Preview ({rows.length} product{rows.length !== 1 ? "s" : ""})
              </h2>
              <p className="mt-2 text-sm text-[#687572]">
                {rows.filter((r) => r.errors.length === 0).length} valid ·{" "}
                {rows.filter((r) => r.errors.length > 0).length} with errors
              </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#EAE6DF] bg-white">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-[#EAE6DF] bg-[#FAF8F4]">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-[#7A827D]">#</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#7A827D]">Product</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#7A827D]">
                      Category / Store
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#7A827D]">Price</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#7A827D]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF0EB]">
                  {rows.map((row) => {
                    const hasErrors = row.errors.length > 0;
                    return (
                      <tr key={row.rowNumber} className="hover:bg-[#FFFDF9]">
                        <td className="px-4 py-3 text-xs text-[#687572]">{row.rowNumber}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#18302F]">{row.name}</p>
                          <p className="mt-1 text-xs text-[#687572] line-clamp-1">
                            {row.description}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-[#18302F]">{row.category}</p>
                          <p className="text-xs text-[#687572]">{row.store}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{row.price}</td>
                        <td className="px-4 py-3">
                          {hasErrors ? (
                            <div className="space-y-1">
                              <span className="inline-block rounded-full bg-[#FFF1D8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8B5B12]">
                                Error
                              </span>
                              <div className="text-xs text-red-600">
                                {row.errors.map((err, i) => (
                                  <p key={i}>{err}</p>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="rounded-full bg-[#E5F3EC] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#23684A]">
                              Valid
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleImport}
                disabled={rows.filter((r) => r.errors.length === 0).length === 0}
                className="rounded-lg bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#125858] disabled:opacity-50"
              >
                Import {rows.filter((r) => r.errors.length === 0).length} product
                {rows.filter((r) => r.errors.length === 0).length !== 1 ? "s" : ""}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("upload");
                  setRows([]);
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="rounded-lg border border-[#EAE6DF] px-6 py-3 text-sm font-medium transition hover:bg-[#F4F0E9]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === "importing" && (
          <div className="rounded-lg border border-[#EAE6DF] bg-white p-8 text-center">
            <p className="text-sm text-[#687572]">Importing products...</p>
          </div>
        )}

        {step === "complete" && importResult && (
          <div className="space-y-6">
            <div className="rounded-lg border border-[#CFE1D4] bg-[#E5F3EC] p-6">
              <h2 className="font-serif text-xl font-semibold text-[#23684A]">Import complete</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-2xl font-bold text-[#23684A]">{importResult.created}</p>
                  <p className="text-sm text-[#687572]">Created</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#8B5B12]">{importResult.skipped}</p>
                  <p className="text-sm text-[#687572]">Skipped</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#DC2626]">{importResult.failed}</p>
                  <p className="text-sm text-[#687572]">Failed</p>
                </div>
              </div>
            </div>

            {importResult.details.length > 0 && (
              <div className="rounded-lg border border-[#EAE6DF] bg-white p-6">
                <h3 className="font-semibold text-[#18302F]">Details</h3>
                <div className="mt-4 space-y-2 text-sm">
                  {importResult.details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className={`mt-1 inline-block h-2 w-2 rounded-full flex-shrink-0 ${
                          detail.status === "created"
                            ? "bg-[#23684A]"
                            : detail.status === "skipped"
                              ? "bg-[#8B5B12]"
                              : "bg-[#DC2626]"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-[#18302F]">
                          Row {detail.rowNumber}: {detail.name}
                        </p>
                        <p className="text-[#687572]">{detail.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <a
                href="/admin/products"
                className="rounded-lg bg-[#176B6B] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#125858]"
              >
                View products
              </a>
              <button
                type="button"
                onClick={() => {
                  setStep("upload");
                  setRows([]);
                  setFile(null);
                  setImportResult(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="rounded-lg border border-[#EAE6DF] px-6 py-3 text-sm font-medium transition hover:bg-[#F4F0E9]"
              >
                Import another batch
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
