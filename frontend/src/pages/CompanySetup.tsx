import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanyConfig, saveCompanyConfig } from "@/api/companyConfig";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const splitValues = (raw: string) =>
  Array.from(
    new Set(
      raw
        .split(/[\n,]/)
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );

const CompanySetup: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === "ADMIN";

  const [departmentsInput, setDepartmentsInput] = useState("");
  const [rolesInput, setRolesInput] = useState("EMP\nINT\nHR");
  const [employmentTypesInput, setEmploymentTypesInput] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      navigate("/dashboard/employee");
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        const config = await fetchCompanyConfig();
        if (!mounted) return;
        setDepartmentsInput((config.departments || []).join("\n"));
        setRolesInput((config.roles || []).join("\n") || "EMP\nINT\nHR");
        setEmploymentTypesInput((config.employment_types || []).join("\n"));
        setLogoUrl(config.logo_url || "");
      } catch (error) {
        if (mounted) {
          toast({
            title: "Unable to load config",
            description: error instanceof Error ? error.message : "Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [isAdmin, isAuthenticated, navigate, toast]);

  const canSave = useMemo(() => {
    const departments = splitValues(departmentsInput);
    const roles = splitValues(rolesInput);
    const employmentTypes = splitValues(employmentTypesInput);
    return (
      departments.length > 0 &&
      roles.length > 0 &&
      employmentTypes.length > 0 &&
      logoUrl.trim().length > 0
    );
  }, [departmentsInput, rolesInput, employmentTypesInput, logoUrl]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAdmin) return;

    const departments = splitValues(departmentsInput);
    const roles = splitValues(rolesInput);
    const employmentTypes = splitValues(employmentTypesInput);
    const trimmedLogoUrl = logoUrl.trim();

    if (!departments.length || !roles.length || !employmentTypes.length || !trimmedLogoUrl) {
      toast({
        title: "All fields are required",
        description: "Enter all lists and upload your company logo.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveCompanyConfig({
        departments,
        roles,
        employment_types: employmentTypes,
        logo_url: trimmedLogoUrl,
      });
      toast({
        title: "Configuration saved",
        description: "Create Employee form now uses these dropdown options.",
      });
      navigate("/dashboard/admin");
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast({
        title: "File too large",
        description: "Please upload an image under 2 MB.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setLogoUrl(result);
      setLogoFileName(file.name);
    };
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "Unable to read the selected image. Please try another file.",
        variant: "destructive",
      });
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-bold text-foreground">Company Input Form</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add one item per line (or comma separated). Roles must be EMP, INT, or HR.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Logo (max 2 MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Upload a logo image file from your device. Maximum size: 2 MB.
              </p>
              {logoFileName ? (
                <p className="mt-1 text-xs text-muted-foreground">Selected: {logoFileName}</p>
              ) : null}
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Company logo preview"
                  className="mt-3 h-16 w-auto rounded border border-border object-contain bg-background p-1"
                />
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Departments
              </label>
              <textarea
                value={departmentsInput}
                onChange={(event) => setDepartmentsInput(event.target.value)}
                rows={5}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Engineering&#10;Sales&#10;Finance"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Roles</label>
              <textarea
                value={rolesInput}
                onChange={(event) => setRolesInput(event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="EMP&#10;INT&#10;HR"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Employment Types
              </label>
              <textarea
                value={employmentTypesInput}
                onChange={(event) => setEmploymentTypesInput(event.target.value)}
                rows={5}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Full-time&#10;Part-time&#10;Contract"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isLoading || isSaving || !canSave}
                className="rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Setup"}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default CompanySetup;
