import { Ionicons } from "@expo/vector-icons";

declare global {
    var authToken: string | null;

    type IoniconName = React.ComponentProps<typeof Ionicons>["name"];
}

export { };

