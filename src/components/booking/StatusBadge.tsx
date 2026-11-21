const styles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-green-50 text-green-700",
  Completed: "bg-blue-50 text-blue-700",
  Cancelled: "bg-red-50 text-red-700",
};

const StatusBadge = ({ status }: { status?: string }) => {
  const value = status || "Pending";
  const color = styles[value] ?? "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
};

export default StatusBadge;
