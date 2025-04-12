import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/auth-context";
import LandingPage from "./pages/landing-page";
import Dashboard from "./pages/dashboard";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import XPNotification from "./components/common/xp-notification";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/:section" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(10);

  // This function will be provided through context to trigger XP notifications
  const triggerXPNotification = (amount: number) => {
    setXpAmount(amount);
    setShowXP(true);
    setTimeout(() => setShowXP(false), 3000);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider triggerXP={triggerXPNotification}>
        <Router />
        <Toaster />
        {showXP && <XPNotification amount={xpAmount} />}
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
