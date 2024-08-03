import React from "react";
import Layout from "../../components/layout/Layout";
import "./reg.css";

function Reg() {
  return (
    <Layout>
      <div className="main">
        <div className="box p-6 bg-white shadow-lg rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="uname" className="block text-sm font-medium text-gray-700">UserName</label>
              <input type="text" id="uname" name="uname" className="input"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" name="password" className="input"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" className="input"/>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" id="phone" name="phone" className="input"/>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="add1" className="block text-sm font-medium text-gray-700">Address1</label>
              <textarea name="add1" id="add1" rows="2" className="input responsive-textarea"></textarea>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="add2" className="block text-sm font-medium text-gray-700">Address2</label>
              <textarea name="add2" id="add2" rows="2" className="input responsive-textarea"></textarea>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="security" className="block text-sm font-medium text-gray-700">Security Question</label>
              <input type="text" id="security" name="security" className="input"/>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <button className="btn-primary">Sign Up</button>
            <p className="text-sm text-center mt-2">
              Already registered? <a href="/signin" className="text-blue-600 hover:underline">Sign In</a>
            </p>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="btn-social bg-red-500 hover:bg-red-600">Sign Up with Google</button>
            <button className="btn-social bg-blue-600 hover:bg-blue-700">Sign Up with Facebook</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Reg;
