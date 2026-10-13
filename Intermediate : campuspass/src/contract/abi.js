
export const MEMBERSHIP_ABI = [
  "function owner() view returns (address)",
  "function members(address user) view returns (bool)",
  "function isMember(address user) view returns (bool)",
  "function grantMembership(address user)",
  "function removeMembership(address user)",
  "event MembershipGranted(address indexed user)",
  "event MembershipRemoved(address indexed user)",
];
