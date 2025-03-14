-- insert new record into file

INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- change account_type to "admin"

UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

-- update description for GM Hummer ID 10 to read "a Huge Interior" rather
-- than "small interior"

UPDATE public.inventory SET inv_description = REPLACE (inv_description, 
'small interior', 'a huge interior') WHERE inv_id = 10;

-- inner join including make and model from inventory class name from 
-- classification for items belonging to 'sport'

SELECT inv_make, inv_model, classification_name FROM inventory
INNER JOIN classification on inventory.classification_id = 
classification.classification_id WHERE classification_name = 'Sport';

-- update all image and thumbnail file paths to add '/vehicles' 
--in middle of path in single qery

UPDATE public.inventory SET inv_image = REPLACE (inv_image, '/images', '/images/vehicles'), 
inv_thumbnail = REPLACE (inv_thumbnail, '/images', '/images/vehicles');
