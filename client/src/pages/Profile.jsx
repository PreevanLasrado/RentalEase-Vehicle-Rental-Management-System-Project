import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { FaUser, FaChartBar, FaCog, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const Profile = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [planData, setPlanData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
    }

  }, [navigate]);

  // 🔥 SET FORM DATA
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // 🔥 FETCH STATS
  // 🔥 FETCH STATS + PLAN
  useEffect(() => {
    const fetchStats = async () => {
      try {

        const { data } = await API.get("/bookings/stats");

        setStats(data);

      } catch (error) {

        console.log(error);
      }
    };

    const fetchPlan = async () => {
      try {

        const { data } = await API.get("/plans/current");

        setPlanData(data);

      } catch (error) {

        console.log(error);
      }
    };

    fetchStats();
    fetchPlan();

  }, []);

  // 🔤 INITIALS
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  // 🔄 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 🔥 VALIDATION
  const validateForm = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (/\d/.test(form.name)) {
      newErrors.name = "Name cannot contain numbers";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 UPDATE PROFILE
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data } = await API.put("/users/profile", form);

      login(data);
      toast.success("Profile updated successfully");

      setOpenModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelMembership = async () => {
    try {

      setIsCancelling(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/plans/cancel-membership`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message, {
          id: "cancel-membership-error",

          icon: (
            <FaExclamationCircle className="text-red-500 text-xl" />
          ),

          style: {
            borderRadius: "18px",
            background: "#FEF3F2",
            color: "#B42318",
            border: "1px solid #FECDCA",
            padding: "16px 18px",
            fontWeight: "600",
            whiteSpace: "nowrap",
          },
        });
        setIsCancelling(false);
        return;
      }

      setPlanData((prev) => ({
        ...prev,
        cancelRequested: true,
      }));

      toast.success(
        "Membership cancellation scheduled successfully",
        {
          id: "cancel-membership-success",

          icon: (
            <FaCheckCircle className="text-green-600 text-xl" />
          ),

          style: {
            borderRadius: "18px",
            background: "#ECFDF3",
            color: "#067647",
            border: "1px solid #ABEFC6",
            padding: "16px 18px",
            fontWeight: "600",
            whiteSpace: "nowrap",
            width: "fit-content",
            minWidth: "unset",
            maxWidth: "unset",
          },
        }
      );

      setShowCancelModal(false);

      setIsCancelling(false);

    } catch (error) {

      console.log(error);

      setIsCancelling(false);
    }
  };

  useEffect(() => {
    if (showCancelModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [showCancelModal]);

  useEffect(() => {
    const handleMembershipUpdate = () => {

      const updatedUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (updatedUser) {

        setPlanData((prev) => ({
          ...prev,
          planName: updatedUser.currentPlan,
        }));
      }
    };

    window.addEventListener(
      "membershipUpdated",
      handleMembershipUpdate
    );

    return () => {

      window.removeEventListener(
        "membershipUpdated",
        handleMembershipUpdate
      );
    };

  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-[#f5f0e6] px-10 py-10">

        <div className="max-w-6xl mx-auto space-y-6">

          {/* 🔥 HEADER */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white text-orange-500 flex items-center justify-center text-2xl font-bold border-4 border-black">
              {getInitials(user?.name)}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <span className="mt-2 inline-block bg-white/20 px-3 py-1 rounded-full text-sm capitalize">
                {user?.role}
              </span>{" "}
              <span className="mt-2 inline-block bg-white/20 px-3 py-1 rounded-full text-sm capitalize">
                {user?.currentPlan || "Basic"} Plan
              </span>
            </div>
          </div>

          {/* TITLE */}
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaUser className="text-orange-500" />
              Profile Details
            </h2>
            <div className="w-100 h-1 bg-orange-500 mt-2 rounded"></div>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* ACCOUNT */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FaUser className="text-orange-500" />
                Account Info
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name:</p>
                  <p className="font-semibold">{user?.name}</p>
                </div>

                <div>
                  <p className="text-gray-500">Email:</p>
                  <p className="font-semibold">{user?.email}</p>
                </div>

                <div>
                  <p className="text-gray-500">Role:</p>
                  <p className="font-semibold capitalize">{user?.role}</p>
                </div>

                <div>
                  <p className="text-gray-500">Membership Plan:</p>
                  <p className="font-semibold">{user?.currentPlan || "Basic"}</p>
                </div>

                <div>
                  <p className="text-gray-500">Joined:</p>
                  <p className="font-semibold">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* ACTIVITY */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FaChartBar className="text-orange-500" />
                Activity
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between bg-orange-50 p-3 rounded-lg">
                  <span>Total Bookings</span>
                  <span className="text-orange-500 font-bold">{stats.total}</span>
                </div>

                <div className="flex justify-between bg-green-50 p-3 rounded-lg">
                  <span>Active</span>
                  <span className="text-green-600 font-bold">{stats.active}</span>
                </div>

                <div className="flex justify-between bg-blue-50 p-3 rounded-lg">
                  <span>Completed</span>
                  <span className="text-blue-500 font-bold">{stats.completed}</span>
                </div>

                <div className="flex justify-between bg-red-50 p-3 rounded-lg">
                  <span>Cancelled</span>
                  <span className="text-red-500 font-bold">{stats.cancelled}</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FaCog className="text-orange-500" />
                Actions
              </h3>

              <button
                onClick={() => {
                    setForm({
                        name: user?.name || "",
                        email: user?.email || "",
                    });
                    setErrors({});
                    setOpenModal(true);
                }}
                className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
              >
                Edit Profile
              </button>

              <button 
                onClick={() => navigate("/bookings")}
                className="border py-3 rounded-lg hover:bg-gray-300"
              >
                View Bookings
              </button>

              <button
                onClick={() => setShowCancelModal(true)}
                disabled={(planData?.planName || "Basic") === "Basic"}
                className={`py-3 rounded-lg transition font-medium ${
                  (planData?.planName || "Basic") === "Basic"
                    ? "border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border border-orange-400 text-orange-500 hover:bg-orange-200"
                }`}
              >
                Cancel Membership
              </button>

              <button
                onClick={() => {
                    logout();
                    navigate("/");
                }}
                className="border border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-200"
              >
                Logout
              </button>
            </div>

          </div>

          {/* LAST LOGIN */}
          <div className="bg-white p-6 rounded-2xl shadow-md mt-6 flex justify-between border">
            <div>
              <p className="text-sm text-gray-500">Last Login</p>
              <p className="font-semibold">
                {user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "Not available"}
              </p>
            </div>
            <div className="text-green-500 text-sm">Active</div>
          </div>

        </div>

        {/* MODAL */}
        {openModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setOpenModal(false)}>

            <div className="bg-white p-6 rounded-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>

              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

              {/* NAME */}
              <div className="mb-3">
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input mt-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div className="mb-4">
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input mt-1"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3">

                <button
                  onClick={() => {
                    setForm({
                        name: user?.name || "",
                        email: user?.email || "",
                    });
                    setErrors({});
                    setOpenModal(false);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {loading ? "Saving..." : "Save Changes"}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* CANCEL MEMBERSHIP MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

          <div
            className="relative w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE */}
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition"
            >
              <X size={30} />
            </button>

            {/* TITLE */}
            <h2 className="text-4xl font-bold text-gray-900 -mt-3 mb-4">
              Cancel Membership Plan?
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-lg leading-relaxed">
              Are you sure you want to cancel your
              <span className="font-semibold text-orange-500">
                {" "} {planData?.planName || "Basic"} Membership Plan
              </span>
              ?
            </p>

            {/* EXPIRY BOX */}
            <div className="mt-4 rounded-3xl border border-orange-200 bg-orange-50 p-6">

              <p className="text-gray-800 text-lg">
                Your membership will remain active until:
              </p>

              <h3 className="mt-2 text-2xl font-bold text-center text-orange-500">
                {planData?.expiryDate
                  ? new Date(planData.expiryDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "No Expiry Date"}
              </h3>

              <p className="mt-4 text-gray-600 text-justify text-[17px] leading-relaxed">
                Since payment for your current billing cycle has already been completed,
                your membership will stay active until the expiry date and will then
                be automatically cancelled.
              </p>

            </div>

            {/* ALREADY REQUESTED */}
            {planData?.cancelRequested && (
              <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-500 font-medium">
                Membership cancellation has already been scheduled.
              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-5 -mb-3 flex justify-end gap-4">

              <button
                onClick={() => setShowCancelModal(false)}
                className="px-7 py-3 rounded-2xl border border-gray-300 font-semibold hover:bg-gray-200 transition"
              >
                No
              </button>

              <button
                disabled={planData?.cancelRequested || isCancelling}
                onClick={handleCancelMembership}
                className={`px-7 py-3 rounded-2xl font-semibold text-white transition shadow-lg ${
                  planData?.cancelRequested
                    ? "bg-gray-400 cursor-not-allowed shadow-none"
                    : "bg-red-500 hover:bg-red-600 shadow-red-100"
                }`}
              >
                {isCancelling
                  ? "Cancelling..."
                  : "Yes, Cancel"}
              </button>

            </div>

          </div>
        </div>
      )}

    </Layout>
  );
};

export default Profile;