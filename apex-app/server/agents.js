// Registry of Oracle Fusion AI agents this backend is allowed to call.
// version numbers come from the integration spec provided by the Oracle team.
export const AGENTS = {
  AP_MANAGER: { name: 'AP_MANAGER', version: 99 },
  EMPLOYEE_QUERY_AGENT: { name: 'EMPLOYEE_QUERY_AGENT', version: 5 },
};

export function isKnownAgent(agent) {
  return Object.prototype.hasOwnProperty.call(AGENTS, agent);
}
