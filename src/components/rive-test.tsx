import Rive from 'rive-react-native';

function RiveTest() {
  return <Rive
      url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
      artboardName="Avatar 1"
      stateMachineName="avatar"
      // eslint-disable-next-line react-native/no-inline-styles
      style={{width: 400, height: 400}}
  />;
}

export default RiveTest;