import pigpio
import websocket
import ssl
try:
    import thread
except ImportError:
    import _thread as thread
import time

def map_value(val, in_min, in_max, out_min, out_max):
    val = int(val)
    return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

knob_value = 0

def on_message(ws, message):
    knob_value = message
    pi.set_PWM_dutycycle(
			18,
			map_value(knob_value, 0, 40, 0, 255)
			)
    print(message)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    print("### opened ###")


if __name__ == "__main__":
    pi = pigpio.pi()
    print("pigpio connecting...")

    pi.set_mode(18, pigpio.OUTPUT)
    if not pi.connected:
        print("pigpio not connected")
        exit()

    try:
        # duty cycle from 0 - 255
        pi.set_PWM_dutycycle(18, knob_value)
    except KeyboardInterrupt:
        print('could not set duty cycle?')
        pass

    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://www.joyrats.com/",
				on_message = on_message,
				on_error = on_error,
				on_close = on_close)

    ws.on_open = on_open
    ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})
    #ws.run_forever()


print("exiting")
pi.stop()



