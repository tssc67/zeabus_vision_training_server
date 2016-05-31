#include "stdio.h"
#include "bag.h"
using namespace std;
using namespace cv;
using namespace vision;
std::string cmd;
int main(int argc, char const *argv[]) {
  Bag_Vision bag(argv[1],argv[2]);
  while(true){
    std::getline(std::cin, cmd);
    cout << cmd;
  }
  return 0;
}
