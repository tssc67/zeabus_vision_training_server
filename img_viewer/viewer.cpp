#include "stdio.h"
#include "iostream"
#include "opencv2/imgproc.hpp"
#include "opencv2/highgui.hpp"
using namespace cv;
using namespace std;
Mat image;
static void onMouse( int event, int x, int y, int f, void* ){
 Vec4b pix=image.at<Vec4b>(y,x);
 int B=pix.val[0];
 int G=pix.val[1];
 int R=pix.val[2];
 int A=pix.val[3];
 cout<<R<< " " <<G<<" "<<B<<" "<<A<<endl;

}
int main(int argc, char const *argv[]) {
  cout << argv[1];
  image= imread(argv[1],CV_LOAD_IMAGE_UNCHANGED );
  imshow("image",image);
  setMouseCallback( "image", onMouse, 0 );
  while(waitKey(20));
  return 0;
}
