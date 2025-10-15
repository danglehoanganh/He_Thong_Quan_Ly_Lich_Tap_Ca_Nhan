const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const data = new FormData(e.target);
  const name = data.get("name");
  const email = data.get("email");
  const password = data.get("password");
  const confirm = data.get("confirm");

  // validate email, password 

  try {
    if (formType === "signup") {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Đăng ký thất bại");
        return;
      }

      alert("Đăng ký thành công");
      onClose();
    } else {
      // login
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Đăng nhập thất bại");
        return;
      }

      alert("Đăng nhập thành công");
      onClose();
    }
  } catch (err) {
    setError("Lỗi kết nối server");
  }
};
