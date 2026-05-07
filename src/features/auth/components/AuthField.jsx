import { Input } from "@/components/ui/input";

const AuthField = ({ label, error, ...props }) => {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-200">{label}</label>
      <Input
        {...props}
        aria-invalid={Boolean(error)}
        className="mt-2"
      />
      {error && <p className="mt-2 text-sm text-red-300">{error.message}</p>}
    </div>
  );
};

export default AuthField;
