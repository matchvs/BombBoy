import java.util.ArrayList;
import java.util.List;

public class DropProp extends Position {
    private List<Prop> props = new ArrayList<>();

    public DropProp(int x, int y, List<Prop> p) {
        super(x, y);
        if (p != null)
            this.props = p;
    }
}
