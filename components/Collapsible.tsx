import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { View } from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';

function IconSymbol(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = true;

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol name="chevron-right" size={18} weight="medium" style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }} />

        {title}
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginRight:30,
    padding:0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  content: {
    paddingLeft:30,
    paddingRight:0,
  },
});
