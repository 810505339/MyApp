import { Stack } from './index';
import Launch from '@pages/mainScreen/fightwine/launch';
import LaunchWine from '@pages/mainScreen/fightwine/launchwine';
import Booths from '@pages/mainScreen/fightwine/booths';
const LoginGroup = () => {
  return <Stack.Group>
    <Stack.Screen name="Launch" component={Launch} />
    <Stack.Screen name="LaunchWine" component={LaunchWine} />
    <Stack.Screen name="Booths" component={Booths} />
  </Stack.Group>;
};

export default LoginGroup;
