import matplotlib.pyplot as plt
import numpy as np
from pricing import get_price
import plotly.graph_objects as go

bp = 2000
l = [(2000 * np.exp(0.01 * (1 - (0.02 * i)))) for i in range(0, 30000, 100)]
l = np.array(l) / 300
l += 1
print(l[-100:])
plt.plot(l)

l = [(0.7 - 3 * np.log10((i / 100) + 0.1)) for i in range(0, 100)]
plt.plot(l)
plt.savefig("plot2.png")

basePrice = 4000
seatProportions = np.linspace(0, 1, 100)
daysLeft = np.linspace(1, 300, 100)

seatProportionGrid, daysLeftGrid = np.meshgrid(seatProportions, daysLeft)
priceGrid = get_price(basePrice, seatProportionGrid, daysLeftGrid / 100)

fig = go.Figure(
    data=[
        go.Surface(
            z=priceGrid, x=seatProportionGrid, y=daysLeftGrid, colorscale="Viridis"
        )
    ]
)
fig.update_layout(
    title="Price vs Seat Proportion and Days Left",
    scene=dict(
        xaxis_title="Seat Proportion", yaxis_title="Days Left", zaxis_title="Price"
    ),
)

fig.show()
