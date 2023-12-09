import { View, ViewProps } from './Themed';

export function HStack(props: ViewProps) {
  return <View {...props} style={
    [props.style, {
        'flexDirection': 'column',
    }]} />;
}