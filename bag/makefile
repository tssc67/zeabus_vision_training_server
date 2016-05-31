IDIR =/opt/ros/kinetic/include
LDIR =/opt/ros/kinetic/lib
CC=g++
CFLAGS=-L/opt/ros/kinetic/lib -lpthread -lrosbag_storage -lrostime -lcpp_common -lroscpp -Wl,-rpath,/opt/ros/kinetic/lib -lroscpp_serialization `pkg-config --libs opencv` -std=c++11 -I$(IDIR)

OBJ = bag.o

%.o: %.cpp
	$(CC) -c -o $@ $< $(CFLAGS)

bag: bag.o main.cpp
	$(CC) -o bag main.cpp $(OBJ) $(CFLAGS)

.PHONY: clean

clean:
	rm -f **.o
