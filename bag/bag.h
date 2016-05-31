#ifndef _BAG_INCLUDED
#define _BAG_INCLUDED
#include <string>
#include <sstream>
#include <iostream>
#include <vector>
#include <boost/foreach.hpp>
#include "ros/ros.h"
#include "ros/time.h"
#include "std_msgs/Header.h"
#include "std_msgs/String.h"
#include "std_msgs/UInt8MultiArray.h"
#include "sensor_msgs/CompressedImage.h"
#include "opencv2/imgproc.hpp"
#include "opencv2/highgui.hpp"
#include <rosbag/bag.h>
#include <rosbag/view.h>
#define foreach BOOST_FOREACH

using namespace cv;
namespace vision{
  class Bag_Vision{
  public:
    class img_iterator{
    public:
      img_iterator(rosbag::View::iterator begin,rosbag::View::iterator end);
      img_iterator& operator++();
      img_iterator operator++(int);
      Mat operator*();
    private:
      rosbag::View::iterator curItr;
      rosbag::View::iterator endItr;
    };
    Bag_Vision(std::string filename,std::vector<std::string> topic);
    img_iterator begin(); // First frame of bag
    img_iterator end();
    size_t size();
  private:
    rosbag::Bag bag;
    String topic;
    rosbag::View *view;
  };
}


#endif
