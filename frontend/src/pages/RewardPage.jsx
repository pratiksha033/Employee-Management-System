import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, getAuthConfig } from "../utils/api";
import { Award, Gift, Medal, Trophy, Star } from "lucide-react";

export default function RewardsPage({ user }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRewards, setMyRewards] = useState([]);
  const [allRewards, setAllRewards] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [rewardType, setRewardType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const rewardOptions = [
    "Star Performer",
    "Team Player",
    "Punctual Pro",
    "Fast Learner",
    "Innovator",
    "Top Achiever",
  ];

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const config = getAuthConfig();

      if (user.role === "employee") {
        const res = await axios.get(`${API_BASE_URL}/reward/my`, config);
        setMyRewards(res.data?.rewards || []);
      }

      if (user.role === "admin") {
        const rewardRes = await axios.get(`${API_BASE_URL}/reward/all`, config);
        setAllRewards(rewardRes.data?.rewards || []);

        const empRes = await axios.get(`${API_BASE_URL}/employee/all`, config);
        console.log("Employee API Response:", empRes.data);
        setEmployees(empRes.data?.employees || []);
      }

      const lb = await axios.get(`${API_BASE_URL}/reward/leaderboard`, config);
      setLeaderboard(lb.data?.leaderboard || []);
    } catch (err) {
      console.error("Rewards fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const giveReward = async () => {
    if (!employeeName || !rewardType) {
      alert("Select employee and reward.");
      return;
    }

    setSaving(true);

    try {
      await axios.post(
        `${API_BASE_URL}/reward/give`,
        { employeeName, rewardType },
        getAuthConfig()
      );

      alert("Reward given!");
      setEmployeeName("");
      setRewardType("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to give reward.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-gray-300 text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 space-y-8 text-gray-200 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-teal-400 flex items-center gap-2">
        <Gift /> Rewards & Recognition
      </h1>

      {/* Leaderboard */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-teal-300 flex items-center gap-2">
          <Trophy /> Leaderboard
        </h2>

        {leaderboard.length ? (
          <table className="w-full border border-gray-700 rounded-lg">
            <thead className="bg-gray-900 text-teal-400">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Employee</th>
                <th className="p-3">Rewards</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((it, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-700 hover:bg-gray-700/40"
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{it.employeeName}</td>
                  <td className="p-3 text-teal-300">{it.totalRewards}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No leaderboard data.</p>
        )}
      </div>

      {/* Employee View */}
      {user.role === "employee" && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center gap-2">
            <Medal /> Your Achievements
          </h2>

          {myRewards.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRewards.map((r) => (
                <div
                  key={r._id}
                  className="bg-gray-900 p-4 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Star className="text-yellow-400" />
                    <p className="text-lg font-semibold">{r.rewardType}</p>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(r.dateGiven).toDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No rewards yet.</p>
          )}
        </div>
      )}

      {/* Admin */}
      {user.role === "admin" && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-semibold text-teal-300 mb-4 flex items-center gap-2">
            <Award /> Give a Reward
          </h2>

          <select
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            className="p-3 bg-gray-900 border border-gray-700 rounded-lg w-full mb-4"
          >
            <option value="">Select Employee...</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp.name}>
                {emp.name}
              </option>
            ))}
          </select>

          <select
            value={rewardType}
            onChange={(e) => setRewardType(e.target.value)}
            className="p-3 bg-gray-900 border border-gray-700 rounded-lg w-full mb-4"
          >
            <option value="">Select Reward...</option>
            {rewardOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>

          <button
            onClick={giveReward}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 px-5 py-3 rounded-lg w-full"
          >
            {saving ? "Giving..." : "Give Reward"}
          </button>

          {/* Rewards List */}
          <h3 className="text-xl font-semibold text-teal-300 mt-8">
            Rewards Given
          </h3>

          {allRewards.length ? (
            <ul className="space-y-3 mt-3">
              {allRewards.map((r) => (
                <li
                  key={r._id}
                  className="p-3 bg-gray-900 border border-gray-700 rounded-lg"
                >
                  <strong>{r.employeeName}</strong> — {r.rewardType}
                  <div className="text-gray-400 text-sm">
                    {new Date(r.dateGiven).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No rewards found.</p>
          )}
        </div>
      )}
    </div>
  );
}
