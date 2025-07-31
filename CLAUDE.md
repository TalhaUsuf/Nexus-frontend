# SAAS B2B Nexus product details

design the B2B platform Nexus that acts as a data ingestion platform to gather data from ms teams and ms ecosystem of an organization and acts as a central knowledge hub to which the end-users of that organziation can chat with. there should be admin panel , there should be end user panel. end user should only see the chat bot panel with conversations historyadmin panel should see in what groups / chats the Nexus bot is should be allowed. If a person is already part of a group and it invites the Nexus to that chat the admin should approve it, the admin should have visibility that in what chats / groups / channels the Nexus is a part of. Once the Nexus is made a part of a chat , it will keep continusously ingesting the data from there. Design the Oauth scheme such that the organization admin would be able to Oauth ms teams for his organization with this Nexus platform.


take the components from ShadCN wherever you can, also in the Oauth page show the following permissions to the admin user so that the admin knows exactly what he is allowing.Nexus-Bot will request a minimal set of permissions required for its function:User.Read: To know the bot's own identity within the organization.Team.ReadBasic.All: To list the Teams the bot has been added to.Channel.ReadBasic.All: To list the channels within a Team the bot is a member of.ChannelMessage.Read.All: To read messages in channels the bot is a member of.Chat.Read.All: To read messages in group chats or meetings the bot has been explicitly added to.Files.Read.All: To read files and attachments (images, videos, documents) shared in messages within the channels and chats the bot has access to. This is necessary to make the content of files searchable.also wherever the front end needs a backend call , assume some backend url with complete endpoint name and take all such values from .env sample file in that sample env file also write the description that what this end point will do its inputs and outputs and make that description commentedalso how the endusers who have joined will be able to see. The login system for them needs to be handled. when they will click the invite link they must be taken to the login screen and then should be seeing the chat panel view. also update the chat interface and then each answer should show the references based on which the answer has been generated. when i click on those references , in pop up i should be able to see the exact line and the metadata.also make the whole UI in light mode, donot use dark mode. 


# What to do

 - the UI functionality has been implemented already
 - make sure that the admin workflow is complete, admin will Oauth using MS credentials and then he will be able to see the admin panel
    - admin can add the users, the front end is complete , implement and integrate the backend for this functionality
    - admin can send the invite links to the users
    - admin will be able to see the analytics regarding the data that has been ingested
 - End-user will receive invite email and when he will click on invite email, he will be taken to the login route on front end where he will be making account
    - end user will only see the chat bot type thing on the panel , the UI is already there just need to implement /integrate the backend
 - Integration wil MS teams flow
   - when admin does Oauth for the organization MS teams, the oauth will gain access to certain permissions:
        User.Read: To know the bot's own identity within the organization.

        Team.ReadBasic.All: To list the Teams the bot has been added to.

        Channel.ReadBasic.All: To list the channels within a Team the bot is a member of.

        ChannelMessage.Read.All: To read messages in channels the bot is a member of.

        Chat.Read.All: To read messages in group chats or meetings the bot has been explicitly added to.

        Files.Read.All: To read files and attachments (images, videos, documents) shared in messages within the channels and chats the bot has access to. This is necessary to make the content of files searchable.
   -  now the nexus will be a part of the organization - teams and can be included in any team channel / group / 1-1 chat. 
   -  nexus will ingest all the data from locations of which its a part of
   -  nexus will keep ingesting the data whenever a new data comes and also the data prior to its inclusion.
   - end user will login  and see the chat panel inside which he can ask questions and get the answer back
   - end user will also see the chat history panel to see the historic chat data
   - when there is request to add the Nexus to any group chat or any 1-1 chat, the bot will not consume any messages unless the admin has granted approval. admin will see the approval 
   request and can allow it.