import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  // ShoppingCartOutlined,
  // GithubOutlined,
} from "@ant-design/icons";
import "../styles/DefaultLayout.css";
import Spinner from "./Spinner";
import logo from "../assets/logo.png";
const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { billItems, loading } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };
  //to get localstorage data
  useEffect(() => {
    localStorage.setItem("billItems", JSON.stringify(billItems));
  }, [billItems]);

  return (
    <Layout>
      {loading && <Spinner />}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="logo"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={logo} width="150" alt="logo" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills">Bills</Link>
          </Menu.Item>
          <Menu.Item key="/items" icon={<UnorderedListOutlined />}>
            <Link to="/items">Stocks</Link>
          </Menu.Item>
          <Menu.Item key="/customers" icon={<UserOutlined />}>
            <Link to="/customers">Customers</Link>
          </Menu.Item>
          <Menu.Item key="/reports" icon={<CopyOutlined />}>
            <Link to="/reports">Reports</Link>
          </Menu.Item>
          {/* <Menu.Item key="/dev" icon={<GithubOutlined />}>
            <a
              href="https://github.com/ishanaudichya/business-erp-mern"
              target="_blank"
              rel="noopener noreferrer"
            >
              Git Repo
            </a>
          </Menu.Item> */}
          <Menu.Item
            key="/logout"
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem("auth");
              navigate("/login");
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
        <div
          className="text-center text-light font-wight-bold mb-4 b-0 w-100 position-absolute"
          style={{ position: "absolute", bottom: "0", width: "100%" }}
        >
          2024 ©<br></br>{" "}
          <a href="https://siplhub.com/" target="_blank" rel="noreferrer">
            Sikharthy Infotech Pvt. Ltd.
          </a>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {/* {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )} */}
          <div onClick={() => navigate("/cart")}>
            <div style={{ position: "relative", display: "flex", gap: 10 }}>
              <button className="invoice-btn">Bill</button>
              {billItems.length > 0 && (
                <p
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "4px 8px",
                    fontSize: "12px",
                  }}
                >
                  {billItems.length}
                </p>
              )}
            </div>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
