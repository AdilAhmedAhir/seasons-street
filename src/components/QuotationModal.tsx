"use client";

import React, { useState, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

type OrderType = "standard" | "custom";

interface QuoteFormData {
    companyName: string;
    email: string;
    phone: string;
    product: string;
    customDescription: string;
    quantity: number | "";
    notes: string;
    file: File | null;
}

interface FormErrors {
    companyName?: string;
    email?: string;
    quantity?: string;
    product?: string;
    customDescription?: string;
    file?: string;
}

const productOptions = [
    "Paper Quilling Earrings - Red & White",
    "Paper Quilling Earrings - Emerald",
    "Paper Quilling Necklace - Ivory Cascade",
    "Paper Quilling Studs - Blossom",
    "Paper Quilling Set - Ruby Collection",
    "Sustainable Disposable Plates",
    "Sustainable Disposable Bowls",
    "Handicraft — Custom Item",
];

interface QuotationModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultOrderType?: OrderType;
}

export default function QuotationModal({
    isOpen,
    onClose,
    defaultOrderType = "standard",
}: QuotationModalProps) {
    const [orderType, setOrderType] = useState<OrderType>(defaultOrderType);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [formData, setFormData] = useState<QuoteFormData>({
        companyName: "",
        email: "",
        phone: "",
        product: "",
        customDescription: "",
        quantity: "",
        notes: "",
        file: null,
    });

    const minQuantity = orderType === "standard" ? 100 : 200;

    const resetForm = useCallback(() => {
        setFormData({
            companyName: "",
            email: "",
            phone: "",
            product: "",
            customDescription: "",
            quantity: "",
            notes: "",
            file: null,
        });
        setErrors({});
        setSubmitError(null);
        setIsSuccess(false);
    }, []);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose, resetForm]);

    // Update orderType when defaultOrderType changes and modal opens
    React.useEffect(() => {
        if (isOpen) {
            setOrderType(defaultOrderType);
            resetForm();
        }
    }, [isOpen, defaultOrderType, resetForm]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (orderType === "standard" && !formData.product) {
            newErrors.product = "Please select a product";
        }

        if (orderType === "custom" && !formData.customDescription.trim()) {
            newErrors.customDescription = "Please describe your custom design";
        }

        if (!formData.quantity || Number(formData.quantity) < minQuantity) {
            newErrors.quantity = `Minimum order quantity is ${minQuantity} pieces`;
        }

        if (orderType === "custom" && !formData.file) {
            newErrors.file = "Please upload your custom design file";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const body = new FormData();
            body.append("orderType", orderType);
            body.append("companyName", formData.companyName);
            body.append("email", formData.email);
            if (formData.phone) body.append("phone", formData.phone);
            if (formData.product) body.append("product", formData.product);
            if (formData.customDescription) body.append("customDescription", formData.customDescription);
            body.append("quantity", String(formData.quantity));
            if (formData.notes) body.append("notes", formData.notes);
            if (formData.file) body.append("file", formData.file);

            const response = await fetch("/api/quote", {
                method: "POST",
                body,
            });

            const result = await response.json();

            if (response.ok) {
                setIsSuccess(true);
            } else {
                setSubmitError(result.error || "Failed to submit. Please try again.");
            }
        } catch {
            setSubmitError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: keyof QuoteFormData, value: string | number | File | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Request a Quotation">
            {isSuccess ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gold mb-2">Quotation Submitted!</h3>
                    <p className="text-text-secondary text-sm mb-6">
                        We&apos;ll review your request and get back to you within 24-48 hours.
                    </p>
                    <Button variant="outline" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Order Type Toggle */}
                    <div className="flex rounded-lg bg-gray-100 p-1 gap-1">
                        {(["standard", "custom"] as const).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => {
                                    setOrderType(type);
                                    setErrors({});
                                }}
                                className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${orderType === type
                                    ? "bg-gold text-white shadow-sm"
                                    : "text-text-muted hover:text-text-primary"
                                    }`}
                            >
                                {type === "standard" ? "Standard Order" : "Custom Order"}
                            </button>
                        ))}
                    </div>

                    {submitError && (
                        <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                            <p className="text-red-400 text-sm">{submitError}</p>
                        </div>
                    )}

                    <p className="text-text-muted text-xs">
                        {orderType === "standard"
                            ? "Select from our existing catalog designs. MOQ: 100 pieces."
                            : "Upload your custom design for a bespoke quotation. MOQ: 200 pieces."}
                    </p>

                    {/* Company Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Company Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => updateField("companyName", e.target.value)}
                            placeholder="Your company name"
                            className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors ${errors.companyName ? "border-red-400" : "border-gray-200"
                                }`}
                        />
                        {errors.companyName && (
                            <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Contact Email <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField("email", e.target.value)}
                            placeholder="your@company.com"
                            className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors ${errors.email ? "border-red-400" : "border-gray-200"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 bg-charcoal border border-gray-200 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
                        />
                    </div>

                    {/* Standard: Product Selection | Custom: Description */}
                    {orderType === "standard" ? (
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Product Selection <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.product}
                                onChange={(e) => updateField("product", e.target.value)}
                                className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors appearance-none cursor-pointer ${errors.product ? "border-red-400" : "border-gray-200"
                                    }`}
                            >
                                <option value="">Select a product</option>
                                {productOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            {errors.product && (
                                <p className="text-red-400 text-xs mt-1">{errors.product}</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Custom Design Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={formData.customDescription}
                                onChange={(e) => updateField("customDescription", e.target.value)}
                                placeholder="Describe your custom design requirements..."
                                rows={3}
                                className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors resize-none ${errors.customDescription ? "border-red-400" : "border-gray-200"
                                    }`}
                            />
                            {errors.customDescription && (
                                <p className="text-red-400 text-xs mt-1">{errors.customDescription}</p>
                            )}
                        </div>
                    )}

                    {/* Custom: File Upload */}
                    {orderType === "custom" && (
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Upload Design File <span className="text-red-400">*</span>
                            </label>
                            <label
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:bg-gold/5 ${errors.file
                                    ? "border-red-400"
                                    : formData.file
                                        ? "border-gold/50 bg-gold/5"
                                        : "border-gold/20"
                                    }`}
                            >
                                {formData.file ? (
                                    <div className="text-center">
                                        <svg className="w-8 h-8 mx-auto text-gold mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-gold text-sm font-medium">{formData.file.name}</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <svg className="w-8 h-8 mx-auto text-gold/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-text-muted text-sm">
                                            Drag & drop or <span className="text-gold">browse</span>
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*,.pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        updateField("file", file);
                                    }}
                                />
                            </label>
                            {errors.file && (
                                <p className="text-red-400 text-xs mt-1">{errors.file}</p>
                            )}
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Quantity (pieces) <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="number"
                            min={minQuantity}
                            value={formData.quantity}
                            onChange={(e) =>
                                updateField("quantity", e.target.value === "" ? "" : Number(e.target.value))
                            }
                            placeholder={String(minQuantity)}
                            className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors ${errors.quantity ? "border-red-400" : "border-gray-200"
                                }`}
                        />
                        <p className="text-text-muted text-xs mt-1">
                            {orderType === "standard"
                                ? "Minimum Order Quantity: 100 pieces"
                                : "Minimum Order Quantity for Custom Designs: 200 pieces"}
                        </p>
                        {errors.quantity && (
                            <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Additional Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => updateField("notes", e.target.value)}
                            placeholder="Special packaging, color preferences, delivery timeline..."
                            rows={3}
                            className="w-full px-4 py-3 bg-charcoal border border-gray-200 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Quotation Request"}
                    </Button>
                </form>
            )}
        </Modal>
    );
}
