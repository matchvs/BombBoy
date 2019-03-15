import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyListener;
import java.util.ArrayList;


public class Window extends JFrame {
    private java.util.List<Player> players = new ArrayList();
    private Map map;
    JPanel comp = new JPanel() {
        int padding = 10;
        int nodeWidth = GameConfig.BASE_NODE_WIDTH;

        public void paint(Graphics g) {
            super.paint(g);
            Graphics2D g2d = (Graphics2D) g;

            g2d.setColor(Color.RED);

            for (int i = 0; i < map.mapArray.length; i++) {
                int[] temp = map.mapArray[i];
                for (int j = 0; j < temp.length; j++) {
                    g2d.drawString(temp[j] + "", nodeWidth * j + padding * 3, i * nodeWidth + padding * 4);
                    g2d.drawRect(nodeWidth * j + padding, i * nodeWidth + padding, nodeWidth, nodeWidth);
                }
            }

            g2d.setColor(Color.darkGray);
            for (int i = 0; i < players.size(); i++) {
                g2d.drawRect(players.get(i).xInMap + padding, players.get(i).yInMap + padding, nodeWidth, nodeWidth);
            }
        }
    };

    public Window(KeyListener listener, Map map) {
        this.map = map;
        this.setTitle("BombBoy!");
        this.add(comp);
        this.addKeyListener(listener);
        this.setSize(1080, 768);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setVisible(true);
    }

    public void setPlayers(java.util.List<Player> p1) {
        this.players = p1;
    }

    @Override
    public void update(Graphics g) {
        super.update(g);
    }

    public void close() {
        this.setVisible(false);
    }
}

