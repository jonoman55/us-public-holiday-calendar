import { lazy } from "react";
import { HashRouter as Router, Routes as Switch, Route } from "react-router-dom";

import Layout from "../components/Layout";
import type { Lazy } from "../types";

const HomePage: Lazy = lazy(() => import("../pages/HomePage"));

/**
 * App Routes
 */
export default function Routes() {
    return (
        <Router>
            <Layout>
                <Switch>
                    <Route path="/" element={<HomePage />} />
                </Switch>
            </Layout>
        </Router>
    );
}
