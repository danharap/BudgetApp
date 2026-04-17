import { Tabs } from 'expo-router';
import { FloatingTabBar } from '../../components/ui/FloatingTabBar';
import { useLoadAppData } from '../../hooks/useLoadAppData';

export default function TabsLayout() {
  useLoadAppData();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
