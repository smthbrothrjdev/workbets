import PropTypes from "prop-types";

export function AdminPanel({ users }) {
  return (
    <section className="space-y-6 rounded-3xl bg-white p-6 shadow-soft">
      <div>
        <p className="text-sm text-slate-500">Admin</p>
        <h3 className="text-2xl font-semibold text-slate-900">
          Manage your workplace
        </h3>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-100">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Workplace</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {user.workplace}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700"
                    >
                      Assign role
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                    >
                      Move
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600"
                    >
                      Reset password
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

AdminPanel.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      workplace: PropTypes.string.isRequired,
    })
  ).isRequired,
};
