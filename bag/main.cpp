#include "cstdio"
#include <thread>
#include "bag.h"
#include <mutex>
using namespace std;
using namespace cv;
using namespace vision;
struct ct_msg{
  Mat img;
  bool ended;
};
queue<ct_msg> ct_msg_q; // Cross Thread message queue
std::mutex mtx;
void ui(){
  int n = 5;
  while(true){
    if(!ct_msg_q.empty()){ // Check queue ,safe
      if(ct_msg_q.front().ended)return;
      imshow("img",ct_msg_q.front().img);
      ct_msg_q.pop();
    }
    waitKey(1);
  }
}

int main(int argc, char const *argv[]) {
  std::string cmd;
  std::string cmd_type;
  vector<std::string> topics;
  for(int i=1;i<argc;++i)topics.push_back(argv[i]);
  Bag_Vision bag(argv[1],topics);
  Bag_Vision::img_iterator cur = bag.begin();
  cout << "OK" << bag.size() << endl;
  // fflush(stdout);
  int frame = 0;
  thread ui_t(ui);//UI Thread
  ct_msg msg;
  while(true){
    getline(cin, cmd);
    cmd_type = cmd.substr(0,4);
    if(cmd_type=="NEXT"){
      frame++;
      cur++;
    }
    else if(cmd_type=="SAVE"){
      imwrite(cmd.substr(5,cmd.size()-5),*cur);
      cout << "OK";
    }
    else if(cmd_type=="SHOW"){
      msg.img = *cur;
      msg.ended = false;
      mtx.lock(); // Perform mutex locking ensuring thread-safe mechanism
      ct_msg_q.push(msg);
      mtx.unlock();
    }
    else{
      msg.ended = true;
      ct_msg_q.push(msg);
      break;
    };
  }
  ui_t.join();
  return 0;
}
