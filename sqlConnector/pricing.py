import numpy as np


def get_price(basePrice, seatProportion, daysLeft):
    daysLeft *= 100
    dateCoeff = (basePrice * np.exp(0.01 * (1 - (0.02 * daysLeft))) / 300) + 1
    seatCoeff = 0.7 - 3 * np.log10((seatProportion) + 0.1)
    return basePrice * dateCoeff * seatCoeff / (basePrice // 1000) ** 1.5


