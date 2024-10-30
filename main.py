def StringChallenge(strParam):

  cleaned = ''.join(char.lower() for char in strParam if char.isalnum())

  return "true" if cleaned == cleaned[ ::-1 ] else "false"


print(StringChallenge("A war at Tarawa!"))


