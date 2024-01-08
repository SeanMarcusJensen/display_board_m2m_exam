import { View, ViewProps } from './Themed';

export function VStack(props: ViewProps) {
  return <View {...props} style={
    [props.style, {
        'flexDirection': 'row',
    }]} />;
}