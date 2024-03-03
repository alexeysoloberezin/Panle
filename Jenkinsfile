import jenkins.*
import jenkins.model.* 
import hudson.*  
import hudson.model.*
   
   
def agent_selector() {  
echo  scm.branches[0].name
    if (scm.branches[0].name == '*/dev') {
        return "*****"
    } else if (scm.branches[0].name == '*/master') {
        return "*****"
    } else {
        println("Could not get Agent from branch !")
        error('Aborting Build.')
    }
}

pipeline {
     agent {label agent_selector()}

    stages {
        stage('Build') {
            steps {
 script {
            echo  scm.branches[0].name
            if (scm.branches[0].name == '*/master') {
            
                echo  scm.branches[0].name
                sh "rm .env"
                sh "mv .env.prod .env"
                sh "npm install"
                sh "npm run build"
                sh "npm run postinstall"
                sh "sudo rm -r /var/www/html/*"
                sh "sudo cp -R ./* /var/www/html/"
            }else if (scm.branches[0].name == '*/dev') {    
                echo  scm.branches[0].name
                sh "rm .env"
                sh "mv .env.dev .env"                
                sh "npm install"
                sh "npm run build"
                sh "npm run postinstall"
                sh "sudo rm -r /var/www/html/*"
                sh "sudo cp -R ./* /var/www/html/"
            } else {
             echo  scm.branches[0].name
            }  
            }            
            
            
            
            
            
      

            }  
        }
    }
}
