// app/withAuth.js (or another location in your project)
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("userToken");

      if (!token) {
        router.push("/login"); // Redirect to login if no token is found
      }
    }, [router]);

    // Only render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
