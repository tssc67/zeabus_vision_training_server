IDIR =/opt/ros/kinetic/include
CC=g++
CFLAGS=-I$(IDIR)

ODIR=obj
LDIR =/opt/ros/kinetic/lib

LIBS=-lrosbag

_DEPS = bag.h
DEPS = $(patsubst %,$(IDIR)/%,$(_DEPS))

_OBJ = bag.o
OBJ = $(patsubst %,$(ODIR)/%,$(_OBJ))


$(ODIR)/%.o: %.c $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

bag: $(OBJ)
	gcc -o $@ $^ $(CFLAGS) $(LIBS)

.PHONY: clean

clean:
	rm -f $(ODIR)/*.o *~ core $(INCDIR)/*~
